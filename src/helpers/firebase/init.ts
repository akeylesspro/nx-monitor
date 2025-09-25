import { initializeApp, type FirebaseApp } from "firebase/app";
import { type FirebaseStorage, getStorage } from "firebase/storage";
import { type Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

interface FirebaseInitResult {
    db: Firestore;
    auth: Auth;
    storage: FirebaseStorage;
    app: FirebaseApp;
    googleLoginProvider: GoogleAuthProvider;
}

const initApp = (): FirebaseInitResult => {
    const firebaseConfig = {
        apiKey: import.meta.env.VITE_API_KEY,
        authDomain: import.meta.env.VITE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_APP_ID,
    };
    const app: FirebaseApp = initializeApp(firebaseConfig);
    const auth: Auth = getAuth(app);
    auth.settings.appVerificationDisabledForTesting = false;
    const db: Firestore = getFirestore(app);
    const storage: FirebaseStorage = getStorage(app);
    const googleLoginProvider = new GoogleAuthProvider();

    const result: FirebaseInitResult = { db, auth, storage, app, googleLoginProvider };

    return result;
};

// Initialize app
export const { db, auth, storage, app, googleLoginProvider } = initApp();
