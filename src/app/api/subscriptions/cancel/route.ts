import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';

// This would be the action hook called by GHL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subscriptionId, agencyId } = body; // GHL subscription ID

    if (!subscriptionId || !agencyId) {
      return NextResponse.json({ error: 'Missing subscription cancellation details.' }, { status: 400 });
    }

    // 1. Fetch agency config and subscription from Firestore
    const agencyDoc = await dbAdmin.collection('agencies').doc(agencyId).get();
    const subQuery = await dbAdmin.collection('subscriptions').where('ghlSubscriptionId', '==', subscriptionId).limit(1).get();

    if (!agencyDoc.exists || subQuery.empty) {
      return NextResponse.json({ error: 'Agency or subscription not found.' }, { status: 404 });
    }

    const agencyData = agencyDoc.data()!;
    const originalSub = subQuery.docs[0].data();

    // 2. Call Cardknox API to cancel the subscription
    const cardknoxApiKey = agencyData.cardknoxApiKey; // Decrypt
    const sandboxMode = agencyData.sandboxMode;

    console.log(`Canceling Cardknox subscription ${originalSub.cardknoxSubId}`);
    // await callCardknoxSubCancel(cardknoxApiKey, sandboxMode, originalSub.cardknoxSubId);
    
    // 3. Update subscription status in Firestore
    await dbAdmin.collection('subscriptions').doc(subQuery.docs[0].id).update({
      status: 'canceled',
      updatedAt: new Date(),
    });

    // 4. Update subscription in GHL (PATCH /subscriptions/{id})
    // const ghlAccessToken = agencyData.ghlAccessToken;
    // await patchGhlSubscription(ghlAccessToken, subscriptionId, { status: 'canceled' });

    return NextResponse.json({ success: true, message: 'Subscription canceled successfully.' });

  } catch (error: any) {
    console.error('Subscription Cancel API Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
