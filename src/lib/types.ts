import type { Timestamp } from "firebase-admin/firestore";

export interface Agency {
  id: string; // GHL Agency/Location ID
  name: string;
  ghlAccessToken: string; // Encrypted
  ghlRefreshToken: string; // Encrypted
  ghlTokenExpiresAt: Timestamp;
  providerId?: string; // GHL Custom Provider ID
  cardknoxApiKey?: string; // Encrypted
  sandboxMode: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Transaction {
  id: string; // Firestore doc ID
  agencyId: string;
  ghlTransactionId: string;
  cardknoxRefNum: string;
  status: "pending" | "succeeded" | "failed" | "refunded" | "voided";
  amount: number;
  currency: string;
  contactId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Subscription {
  id: string; // Firestore doc ID
  agencyId: string;
  ghlSubscriptionId: string;
  cardknoxSubId: string;
  status: "active" | "canceled" | "past_due";
  amount: number;
  schedule: string; // e.g., 'monthly', 'yearly'
  contactId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
