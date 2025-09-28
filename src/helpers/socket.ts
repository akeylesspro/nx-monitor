import { type RedisUpdatePayload, type RedisUpdateType, type SocketCallbackResponse } from "akeyless-types-commons";
import { io, Socket } from "socket.io-client";
import { isLocal, mode } from "./utils";
import type { OnSnapshotCallback, OnSnapshotConfig } from "./firebase";

const SESSION_STORAGE_KEY = "sessionId";

interface GetDataPayload<T = any> {
    key: string;
    collection_name: string;
    callback: (value: T) => void;
    defaultValue: T;
}

class SocketService {
    private static instance: SocketService;
    private socket: Socket | null = null;
    private connectCallbacks: Array<() => void> = [];
    private disconnectCallbacks: Array<() => void> = [];
    private authToken: string | null = null;
    private subscribedCollections: Set<string> = new Set();
    private subscriptionConfigs: Map<string, OnSnapshotConfig[]> = new Map();
    /// Initialize the socket connection
    private initSocket(): void {
        if (!this.socket) {
            const socketUrl = isLocal ? "http://localhost:9009" : mode === "qa" ? "https://nx-api.xyz" : "https://nx-api.info";

            this.socket = io(socketUrl, {
                path: "/api/data-socket/connect",
                auth: (cb: any) => {
                    const sessionId = localStorage.getItem(SESSION_STORAGE_KEY) || undefined;
                    const token = this.authToken;
                    const authPayload: Record<string, string> = {};
                    if (token) authPayload.token = token;
                    if (sessionId) authPayload.sessionId = sessionId;
                    cb(authPayload);
                },
                transports: ["websocket"],
                reconnection: true,
                reconnectionAttempts: 30,
                reconnectionDelay: 2 * 1000,
            });

            this.socket.on("connect", () => {
                console.log(`🟢 Socket connected: ${this.socket?.id} (recovered - ${this.socket?.recovered})`);
                this.connectCallbacks.forEach((cb) => cb());
            });

            this.socket.on("disconnect", (reason: Socket.DisconnectReason) => {
                console.log("Socket disconnected:", reason);
                this.disconnectCallbacks.forEach((cb) => cb());
            });

            this.socket.io.on("close", (reason: any) => {
                console.log("Socket Manager close:", reason);
                this.disconnectCallbacks.forEach((cb) => cb());
            });

            this.socket.io.engine.on("close", (reason: any) => {
                console.log("Socket Engine close:", reason);
                this.disconnectCallbacks.forEach((cb) => cb());
            });

            this.socket.on("session", ({ session_id }) => {
                if (session_id) {
                    localStorage.setItem(SESSION_STORAGE_KEY, session_id);
                }
            });
            this.socket.on("connect_error", (error: Error) => {
                console.error("Socket connection error:", error);
            });
        }
    }

    private constructor() {}

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    /// get socket instance
    private getSocketInstance(): Socket {
        if (!this.socket) {
            this.initSocket();
        }
        if (!this.socket) {
            throw new Error("Socket not initialized");
        }
        if (!this.socket.connected) {
            this.socket.connect();
        }
        return this.socket;
    }

    /// connection management methods

    public startSession(token: string): void {
        this.setAuthToken(token);
        this.initSocket();
    }

    public onConnect(callback: () => void): () => void {
        if (!this.connectCallbacks.includes(callback)) {
            this.connectCallbacks.push(callback);
        }
        if (this.socket?.connected) {
            callback();
        }
        return () => this.offConnect(callback);
    }

    public offConnect(callback: () => void): void {
        this.connectCallbacks = this.connectCallbacks.filter((cb) => cb !== callback);
    }

    public onDisconnect(callback: () => void): () => void {
        if (!this.disconnectCallbacks.includes(callback)) {
            this.disconnectCallbacks.push(callback);
        }
        if (this.socket && !this.socket.connected) {
            callback();
        }
        return () => this.offDisconnect(callback);
    }

    public offDisconnect(callback: () => void): void {
        this.disconnectCallbacks = this.disconnectCallbacks.filter((cb) => cb !== callback);
    }

    public isConnected(): boolean {
        return this.socket?.connected || false;
    }

    public setAuthToken(token: string) {
        this.authToken = token;
        if (this.socket) {
            this.socket.connect();
        }
    }

    public disconnectSocket(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket.io.engine.close();
        }
        // Clear subscription tracking when disconnecting
        this.subscribedCollections.clear();
        this.subscriptionConfigs.clear();
    }

    /// subscribe to collections
    public subscribeToCollections(config: OnSnapshotConfig[]): () => void {
        if (config.length === 0) {
            return () => {};
        }
        
        const s = this.getSocketInstance();
        const collectionsNames = config.map((c) => c.collectionName);

        // Filter out collections that are already subscribed
        const newCollections = [...new Set(collectionsNames.filter((collectionName) => !this.subscribedCollections.has(collectionName)))];

        if (newCollections.length === 0) {
            console.log(`All collections already subscribed: ${collectionsNames.join(", ")}`);
            return () => {};
        }

        const eventHandlers: Array<{ eventName: string; handler: OnSnapshotCallback }> = [];

        config.forEach((configuration) => {
            const { collectionName, onAdd, onFirstTime, onModify, onRemove, extraParsers } = configuration;

            // Only process collections that are not already subscribed
            if (!this.subscribedCollections.has(collectionName)) {
                // Before attaching, make sure the specific handler is NOT already registered.
                const attach = (eventName: string, handler?: OnSnapshotCallback) => {
                    if (!handler) return;
                    this.socket!.off(eventName, handler);
                    this.socket!.on(eventName, handler);
                    eventHandlers.push({ eventName, handler });
                };
                
                attach(`initial:${collectionName}`, onFirstTime);
                attach(`add:${collectionName}`, onAdd);
                attach(`update:${collectionName}`, onModify);
                attach(`delete:${collectionName}`, onRemove);

                extraParsers?.forEach((parsers) => {
                    const { onAdd: extraOnAdd, onFirstTime: extraOnFirstTime, onModify: extraOnModify, onRemove: extraOnRemove } = parsers;
                    attach(`initial:${collectionName}`, extraOnFirstTime);
                    attach(`add:${collectionName}`, extraOnAdd);
                    attach(`update:${collectionName}`, extraOnModify);
                    attach(`delete:${collectionName}`, extraOnRemove);
                });

                // Mark collection as subscribed and store its config
                this.subscribedCollections.add(collectionName);
                this.subscriptionConfigs.set(collectionName, [configuration]);
            } else {
                // If already subscribed, just add the new config to existing ones
                const existingConfigs = this.subscriptionConfigs.get(collectionName) || [];
                existingConfigs.push(configuration);
                this.subscriptionConfigs.set(collectionName, existingConfigs);
            }
        });

        // Only emit subscription for new collections
        if (newCollections.length > 0) {
            s.emit("subscribe_collections", newCollections, (callback: SocketCallbackResponse) => {
                if (callback.success) {
                    console.log(`Successfully subscribed to: ${newCollections.join(", ")}`);
                } else {
                    console.error(`Failed to subscribe to ${newCollections.join(", ")}: ${callback.message}`);
                    // Remove from tracking if subscription failed
                    newCollections.forEach((collectionName) => {
                        this.subscribedCollections.delete(collectionName);
                        this.subscriptionConfigs.delete(collectionName);
                    });
                }
            });
        }

        return () => {
            console.log(`Cleaning up subscriptions for: ${collectionsNames.join(", ")}`);

            // Remove configs for this specific subscription
            collectionsNames.forEach((collectionName) => {
                const existingConfigs = this.subscriptionConfigs.get(collectionName) || [];
                const filteredConfigs = existingConfigs.filter((c) => !config.includes(c));

                if (filteredConfigs.length === 0) {
                    // No more configs for this collection, unsubscribe
                    this.subscribedCollections.delete(collectionName);
                    this.subscriptionConfigs.delete(collectionName);
                    s.emit("unsubscribe_collections", [collectionName]);
                } else {
                    // Update with remaining configs
                    this.subscriptionConfigs.set(collectionName, filteredConfigs);
                }
            });

            eventHandlers.forEach((eh) => {
                s.off(eh.eventName, eh.handler);
            });
        };
    }

    /// set data
    public setData<UpdateType extends RedisUpdateType, DataType = any>(
        payload: RedisUpdatePayload<UpdateType, DataType>
    ): Promise<SocketCallbackResponse> {
        const s = this.getSocketInstance();

        return new Promise((resolve, reject) => {
            s.emit("set_data", payload, (callback: SocketCallbackResponse) => {
                if (callback.success) {
                    console.log("Data saved successfully:", payload);
                    console.log("ack", callback);
                    resolve(callback);
                } else {
                    reject(new Error(callback.message || "Save operation failed"));
                }
            });
        });
    }

    /// get data
    public getCollectionData<T>(payload: Omit<GetDataPayload<T>, "key">): void {
        const s = this.getSocketInstance();
        s.emit("get_data", { collection_name: payload.collection_name }, (socketCallback: SocketCallbackResponse) => {
            if (socketCallback.success && socketCallback.data) {
                payload.callback(socketCallback.data as T);
            } else {
                payload.callback(payload.defaultValue);
            }
        });
    }

    public getDocumentData<T>(payload: GetDataPayload<T>): void {
        const s = this.getSocketInstance();
        s.emit("get_data", { collection_name: payload.collection_name, key: payload.key }, (socketCallback: SocketCallbackResponse) => {
            if (socketCallback.success && socketCallback.data) {
                payload.callback(socketCallback.data as T);
            } else {
                payload.callback(payload.defaultValue);
            }
        });
    }

    /// delete data
    public deleteData(payload: { key: string; collection_name: string }): Promise<SocketCallbackResponse> {
        const s = this.getSocketInstance();
        return new Promise((resolve, reject) => {
            s.emit("delete_data", payload, (callback: SocketCallbackResponse) => {
                if (callback.success) {
                    console.log("Data deleted successfully:", payload);
                    console.log("delete ack", callback);
                    resolve(callback);
                } else {
                    reject(new Error(callback.message || "Delete operation failed"));
                }
            });
        });
    }

    public clearAllRedisData(): Promise<SocketCallbackResponse> {
        const s = this.getSocketInstance();
        return new Promise((resolve, reject) => {
            s.emit("clear_all_redis_data", (ack: SocketCallbackResponse) => {
                if (ack.success) {
                    resolve(ack);
                } else {
                    reject(new Error(ack.message || "Clear all Redis data operation failed"));
                }
            });
        });
    }
}

export const socketServiceInstance = SocketService.getInstance();
