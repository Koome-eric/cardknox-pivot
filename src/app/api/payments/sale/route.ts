import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';

// Placeholder for Cardknox API client
async function callCardknoxSale(apiKey: string, sandbox: boolean, details: any) {
    // const endpoint = sandbox ? 'https://api-sandbox.cardknox.com/v1/...' : 'https://api.cardknox.com/v1/...';
    console.log(`Calling Cardknox Sale (Sandbox: ${sandbox}) with key ${apiKey.substring(0,8)}...`);
    // Mock successful response
    return { success: true, refNum: `ck_ref_${Date.now()}`, result: 'A', status: 'Approved' };
}

// Placeholder for GHL API client
async function createGhlTransaction(accessToken: string, details: any) {
    console.log(`Creating GHL Transaction for contact ${details.contactId}`);
    // Mock successful response
    return { id: `ghl_trx_${Date.now()}` };
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { agencyId, contactId, amount, xCardNum, xExp, xCVV } = body;

        if (!agencyId || !contactId || !amount || !xCardNum || !xExp || !xCVV) {
            return NextResponse.json({ error: 'Missing required payment details.' }, { status: 400 });
        }

        // 1. Fetch agency configuration from Firestore
        const agencyDoc = await dbAdmin.collection('agencies').doc(agencyId).get();
        if (!agencyDoc.exists) {
            return NextResponse.json({ error: 'Agency configuration not found.' }, { status: 404 });
        }
        const agencyData = agencyDoc.data()!;

        // TODO: Decrypt API key
        const cardknoxApiKey = agencyData.cardknoxApiKey;
        const sandboxMode = agencyData.sandboxMode;
        
        if (!cardknoxApiKey) {
            return NextResponse.json({ error: 'Cardknox API key is not configured for this agency.' }, { status: 400 });
        }

        // 2. Call Cardknox API to process the sale
        const cardknoxResponse = await callCardknoxSale(cardknoxApiKey, sandboxMode, { amount, xCardNum, xExp, xCVV });

        if (!cardknoxResponse.success) {
            // TODO: Log failed transaction in Firestore
            return NextResponse.json({ error: `Cardknox Error: ${cardknoxResponse.status}` }, { status: 402 });
        }
        
        // 3. Sync transaction to GHL
        // TODO: Get GHL access token and handle refresh
        const ghlAccessToken = agencyData.ghlAccessToken;
        const ghlTransaction = await createGhlTransaction(ghlAccessToken, {
            contactId,
            amount,
            status: 'succeeded', // Map Cardknox status to GHL status
            provider: 'cardknox',
            providerTransactionId: cardknoxResponse.refNum,
        });

        // 4. Store transaction details in Firestore for reconciliation
        const transactionId = dbAdmin.collection('transactions').doc().id;
        await dbAdmin.collection('transactions').doc(transactionId).set({
            id: transactionId,
            agencyId,
            ghlTransactionId: ghlTransaction.id,
            cardknoxRefNum: cardknoxResponse.refNum,
            status: 'succeeded',
            amount: parseFloat(amount),
            currency: 'USD',
            contactId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        
        return NextResponse.json({ 
            success: true, 
            ghlTransactionId: ghlTransaction.id,
            cardknoxRefNum: cardknoxResponse.refNum,
        });

    } catch (error: any) {
        console.error('Sale API Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
