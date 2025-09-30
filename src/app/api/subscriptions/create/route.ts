import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

// This would be the action hook called by GHL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agencyId, contactId, amount, schedule, cardDetails } = body;

    if (!agencyId || !contactId || !amount || !schedule || !cardDetails) {
      return NextResponse.json({ error: 'Missing required subscription details.' }, { status: 400 });
    }

    // 1. Fetch agency configuration from Firestore
    const agencyDoc = await dbAdmin.collection('agencies').doc(agencyId).get();
    if (!agencyDoc.exists) {
      return NextResponse.json({ error: 'Agency configuration not found.' }, { status: 404 });
    }
    const agencyData = agencyDoc.data()!;

    // 2. Call Cardknox API to create the subscription
    const cardknoxApiKey = agencyData.cardknoxApiKey; // Decrypt
    const sandboxMode = agencyData.sandboxMode;

    console.log(`Creating ${schedule} subscription for ${amount} for contact ${contactId}`);
    // const cardknoxSub = await callCardknoxSubCreate(cardknoxApiKey, sandboxMode, { amount, schedule, cardDetails });

    // Mock response
    const cardknoxSub = { id: `ck_sub_${Date.now()}` };

    // 3. Sync subscription to GHL
    const ghlAccessToken = agencyData.ghlAccessToken; // Refresh if needed
    
    console.log(`Creating GHL subscription for contact ${contactId}`);
    // const ghlSub = await createGhlSubscription(ghlAccessToken, { contactId, amount, schedule, status: 'active' });
    
    // Mock response
    const ghlSub = { id: `ghl_sub_${Date.now()}` };

    // 4. Store subscription details in Firestore
    const subscriptionId = dbAdmin.collection('subscriptions').doc().id;
    await dbAdmin.collection('subscriptions').doc(subscriptionId).set({
      id: subscriptionId,
      agencyId,
      ghlSubscriptionId: ghlSub.id,
      cardknoxSubId: cardknoxSub.id,
      status: 'active',
      amount: parseFloat(amount),
      schedule,
      contactId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      ghlSubscriptionId: ghlSub.id,
      cardknoxSubId: cardknoxSub.id,
    });

  } catch (error: any) {
    console.error('Subscription Create API Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
