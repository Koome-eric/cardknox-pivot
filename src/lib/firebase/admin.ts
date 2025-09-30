// firebaseAdmin.ts
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // Convert escaped newlines back into real line breaks
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount as any),
    });
    console.log("✅ Firebase Admin initialized");
  } catch (error: any) {
    console.error("❌ Firebase Admin initialization error:", error.message);
  }
}

export const authAdmin = getAuth();
export const dbAdmin = getFirestore();
