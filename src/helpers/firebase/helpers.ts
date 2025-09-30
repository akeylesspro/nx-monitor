import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    Timestamp,
    where,
    orderBy,
    onSnapshot,
    type DocumentSnapshot,
    type QuerySnapshot,
    type Query,
    type WhereFilterOp,
    type DocumentData,
} from "firebase/firestore";
import type { StringObject } from "@/types";
import type { OnSnapshotParsers, Snapshot, SnapshotDocument, WhereCondition } from "./types";
import { localIsraelPhoneFormat } from "../utils";
import { db } from "./init";
import type { SetState } from "@/stores/helpers";

// Timestamp
export const firebaseTimestamp = Timestamp.now;

export const extractDocumentData = (doc: DocumentSnapshot<DocumentData>): StringObject => {
    const docData = doc.data();
    return {
        ...docData,
        id: doc.id,
    };
};

export const getDocumentById = async (collection_path: string, doc_id: string) => {
    try {
        const doc_ref = doc(db, collection_path, doc_id);
        const doc_snap = await getDoc(doc_ref);
        if (!doc_snap.exists()) {
            throw new Error("Document not found, document id: " + doc_id);
        }
        return extractDocumentData(doc_snap);
    } catch (error) {
        console.error("Error from get_document_by_id", error);
        return null;
    }
};

export const queryDocument = async (
    collection_path: string,
    field_name: string,
    operator: WhereFilterOp,
    value: any,
    ignore_log = false
): Promise<null | StringObject> => {
    try {
        const q = query(collection(db, collection_path), where(field_name, operator, value));
        const query_snapshot = await getDocs(q);
        const documents = query_snapshot.docs.map((doc) => extractDocumentData(doc));
        if (documents.length < 1) {
            throw new Error(
                `No data to return from: \ncollection: ${collection_path}, \nfield_name: ${field_name}, \noperator: ${operator}, \nvalue: ${value}`
            );
        }
        return documents[0];
    } catch (error) {
        if (!ignore_log) {
            console.error("Error querying document:", error);
        }
        return null;
    }
};

export const queryDocuments = async (collection_path: string, field_name: string, operator: WhereFilterOp, value: any) => {
    try {
        const q = query(collection(db, collection_path), where(field_name, operator, value));
        const query_snapshot = await getDocs(q);
        const documents = query_snapshot.docs.map((doc) => extractDocumentData(doc));
        return documents;
    } catch (error) {
        console.error(`Error querying documents: ${collection_path} - ${field_name} - ${operator} - ${value} `, error);
        return [];
    }
};

export const queryDocumentsByConditions = async (collection_path: string, where_conditions: WhereCondition[]) => {
    try {
        let db_query: any = collection(db, collection_path);
        where_conditions.forEach((condition) => {
            db_query = query(db_query, where(condition.field_name, condition.operator, condition.value));
        });
        const query_snapshot = await getDocs(db_query);
        const documents = query_snapshot.docs.map((doc) => extractDocumentData(doc as DocumentSnapshot<DocumentData>));
        return documents;
    } catch (error) {
        console.error(`Error querying documents: ${collection_path} - ${JSON.stringify(where_conditions)} `, error);
        return [];
    }
};

export const queryDocumentByConditions = async (collection_path: string, where_conditions: WhereCondition[]) => {
    try {
        let db_query: any = collection(db, collection_path);
        where_conditions.forEach((condition) => {
            db_query = query(db_query, where(condition.field_name, condition.operator, condition.value));
        });
        const query_snapshot = await getDocs(db_query);
        const documents = query_snapshot.docs.map((doc) => extractDocumentData(doc as DocumentSnapshot<DocumentData>));
        if (!documents[0]) {
            throw new Error("No data returned from DB");
        }
        return documents[0];
    } catch (error) {
        console.error(`Error querying documents: ${collection_path} - ${JSON.stringify(where_conditions)} `, error);
        return null;
    }
};

export const getUserByPhone = async (phone: string) => {
    const phones = [phone, localIsraelPhoneFormat(phone)];
    return await queryDocument("nx-users", "phone_number", "in", phones, true);
};

export const getUserByEmail = async (email: string) => {
    return await queryDocument("nx-users", "email", "==", email.toLowerCase(), true);
};

export const getUserByIdentifier = async (identifier: string) => {
    return (await getUserByPhone(identifier)) || (await getUserByEmail(identifier));
};

export const snapshot: Snapshot = (config, snapshotsFirstTime, settings) => {
    let resolvePromise: () => void;
    let isResolved = false;
    const promise = new Promise<void>((resolve) => {
        if (!settings?.disableLogs) {
            console.log(`==> ${config.collectionName} subscribed.`);
        }
        resolvePromise = () => {
            if (!isResolved) {
                isResolved = true;
                resolve();
            }
        };
    });

    let collectionRef: Query<DocumentData> = collection(db, config.collectionName);

    if (config.conditions) {
        config.conditions.forEach((condition) => {
            collectionRef = query(collectionRef, where(condition.field_name, condition.operator, condition.value));
        });
    }
    if (config.orderBy) {
        config.orderBy.forEach((order) => {
            collectionRef = query(collectionRef, orderBy(order.fieldName, order.direction));
        });
    }

    const unsubscribe = onSnapshot(
        collectionRef,
        (snapshot: QuerySnapshot<DocumentData>) => {
            const firstTimeKey = JSON.stringify({
                collectionName: config.collectionName,
                conditions: config.conditions || [],
                orderBy: config.orderBy || [],
            });
            if (!snapshotsFirstTime.includes(firstTimeKey)) {
                snapshotsFirstTime.push(firstTimeKey);
                const documents = snapshot.docs.map((doc) => extractDocumentData(doc));

                config.onFirstTime?.(documents, config);
                config.extraParsers?.forEach((extraParser) => {
                    extraParser.onFirstTime?.(documents, config);
                });
                resolvePromise();
            } else {
                const addedDocs: DocumentData[] = [];
                const modifiedDocs: DocumentData[] = [];
                const removedDocs: DocumentData[] = [];
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        addedDocs.push(extractDocumentData(change.doc));
                    } else if (change.type === "modified") {
                        modifiedDocs.push(extractDocumentData(change.doc));
                    } else if (change.type === "removed") {
                        removedDocs.push(extractDocumentData(change.doc));
                    }
                });

                addedDocs.length && config.onAdd?.(addedDocs, config);
                modifiedDocs.length && config.onModify?.(modifiedDocs, config);
                removedDocs.length && config.onRemove?.(removedDocs, config);

                config.extraParsers?.forEach((extraParser) => {
                    addedDocs.length && extraParser.onAdd?.(addedDocs, config);
                    modifiedDocs.length && extraParser.onModify?.(modifiedDocs, config);
                    removedDocs.length && extraParser.onRemove?.(removedDocs, config);
                });
            }
        },
        (error) => {
            console.error(`Error listening to collection: ${config.collectionName}`, error);
            resolvePromise();
        }
    );

    return { promise, unsubscribe };
};

export const snapshotDocument: SnapshotDocument = (config, snapshotsFirstTime) => {
    let resolvePromise: () => void;
    let isResolved = false;
    const promise = new Promise<void>((resolve) => {
        console.log(`==> Document in ${config.collectionName} subscribed.`);
        resolvePromise = () => {
            if (!isResolved) {
                isResolved = true;
                resolve();
            }
        };
    });

    const documentRef = doc(db, config.collectionName, config.documentId);

    const unsubscribe = onSnapshot(
        documentRef,
        (docSnapshot: DocumentSnapshot<DocumentData>) => {
            if (!snapshotsFirstTime.includes(config.collectionName)) {
                snapshotsFirstTime.push(config.collectionName);
                if (docSnapshot.exists()) {
                    const document = extractDocumentData(docSnapshot);
                    if (checkConditions(document, config.conditions)) {
                        config.onFirstTime?.([document], config);
                        config.extraParsers?.forEach((extraParser) => {
                            extraParser.onFirstTime?.([document], config);
                        });
                    } else {
                        console.warn(`Document in ${config.collectionName} does not meet conditions.`);
                    }
                } else {
                    console.warn(`Document not found in ${config.collectionName}.`);
                }
                resolvePromise();
            } else {
                if (docSnapshot.exists()) {
                    const document = extractDocumentData(docSnapshot);
                    if (checkConditions(document, config.conditions)) {
                        config.onModify?.([document], config);
                        config.extraParsers?.forEach((extraParser) => {
                            extraParser.onModify?.([document], config);
                        });
                    }
                } else {
                    config.onRemove?.([], config);
                    config.extraParsers?.forEach((extraParser) => {
                        extraParser.onRemove?.([], config);
                    });
                }
            }
        },
        (error) => {
            console.error(`Error listening to document in ${config.collectionName}:`, error);
            resolvePromise();
        }
    );

    return { promise, unsubscribe };
};

const checkConditions = (document: DocumentData, conditions?: WhereCondition[]): boolean => {
    if (!conditions || conditions.length === 0) return true;
    return conditions.every((condition) => {
        const fieldValue = document[condition.field_name];
        switch (condition.operator) {
            case "==":
                return fieldValue === condition.value;
            case "!=":
                return fieldValue !== condition.value;
            case "<":
                return fieldValue < condition.value;
            case "<=":
                return fieldValue <= condition.value;
            case ">":
                return fieldValue > condition.value;
            case ">=":
                return fieldValue >= condition.value;
            case "array-contains":
                return Array.isArray(fieldValue) && fieldValue.includes(condition.value);
            default:
                return false;
        }
    });
};

interface ParseSnapshotOptions {
    filterCondition?: (v: any) => boolean;
    debug?: boolean;
    debugName?: string;
    deleteId?: boolean;
}

export const parseSnapshotAsObject = (setState: SetState<any>, options?: ParseSnapshotOptions): OnSnapshotParsers => {
    const deleteId = options?.deleteId ?? true;
    return {
        onFirstTime: (docs) => {
            if (docs.length === 0) {
                return;
            }
            if (options?.filterCondition) {
                docs = docs.filter(options?.filterCondition);
            }

            const object: StringObject = {};
            docs.forEach((v) => {
                const id = v.id;
                if (deleteId) {
                    delete v.id;
                }
                object[id] = v;
            });
            if (options?.debug) {
                console.log(`${options?.debugName} onFirstTime`, object);
            }
            setState(object);
        },
        onAdd: (docs) => {
            if (docs.length === 0) {
                return;
            }
            if (options?.filterCondition) {
                docs = docs.filter(options?.filterCondition);
            }

            setState((prev: any) => {
                const update = { ...prev };
                docs.forEach((v) => {
                    const id = v.id;
                    if (deleteId) {
                        delete v.id;
                    }
                    update[id] = v;
                });
                if (options?.debug) {
                    console.log(`${options?.debugName} onAdd`, update);
                }
                return update;
            });
        },
        onModify: (docs) => {
            if (docs.length === 0) {
                return;
            }
            if (options?.filterCondition) {
                docs = docs.filter(options?.filterCondition);
            }

            setState((prev: any) => {
                const update = { ...prev };
                docs.forEach((v) => {
                    const id = v.id;
                    if (deleteId) {
                        delete v.id;
                    }
                    update[id] = v;
                });
                if (options?.debug) {
                    console.log(`${options?.debugName} onModify`, update);
                }
                return update;
            });
        },
        onRemove: (docs) => {
            if (docs.length === 0) {
                return;
            }

            setState((prev: any) => {
                const update = { ...prev };
                docs.forEach((v) => {
                    delete update[v.id];
                });
                if (options?.debug) {
                    console.log(`${options?.debugName} onRemove`, update);
                }
                return update;
            });
        },
    };
};

export const parseSnapshotAsArray = (setState: SetState<any>, options?: ParseSnapshotOptions): OnSnapshotParsers => {
    return {
        onFirstTime: (docs: any[]) => {
            if (docs.length === 0) {
                return;
            }
            if (options?.filterCondition) {
                docs = docs.filter(options?.filterCondition);
            }
            if (options?.debug) {
                console.log(`${options?.debugName} onFirstTime`, docs);
            }
            setState(docs);
        },
        onAdd: (docs: any[]) => {
            if (docs.length === 0) {
                return;
            }
            if (options?.filterCondition) {
                docs = docs.filter(options?.filterCondition);
            }
            if (options?.debug) {
                console.log(`${options?.debugName} onAdd`, docs);
            }
            setState((prev: any) => [...prev, ...docs]);
        },
        onModify: (docs: any[]) => {
            if (docs.length === 0) {
                return;
            }
            if (options?.filterCondition) {
                docs = docs.filter(options?.filterCondition);
            }
            if (options?.debug) {
                console.log(`${options?.debugName} onModify`, docs);
            }
            setState((prev: any) => {
                const newState = [...prev];
                docs.forEach((doc: any) => {
                    const index = newState.findIndex((d: any) => d.id === doc.id);
                    if (index !== -1) {
                        newState[index] = doc;
                    }
                });
                return newState;
            });
        },
        onRemove: (docs: any[]) => {
            if (docs.length === 0) {
                return;
            }
            if (options?.filterCondition) {
                docs = docs.filter(options?.filterCondition);
            }
            if (options?.debug) {
                console.log(`${options?.debugName} onRemove`, docs);
            }
            setState((prev: any) => prev.filter((doc: any) => !docs.some((d: any) => d.id === doc.id)));
        },
    };
};
