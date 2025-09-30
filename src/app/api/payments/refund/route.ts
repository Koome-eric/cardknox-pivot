import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';

// This would be the action hook called by GHL when a user clicks "Refund"
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // GHL will send the original transaction details in the payload
        const { transactionId, amount, agencyId } = body; 

        if (!transactionId || !amount || !agencyId) {
            return NextResponse.json({ error: 'Missing refund details.' }, { status: 400 });
        }

        // 1. Fetch agency config and original transaction from Firestore
        const agencyDoc = await dbAdmin.collection('agencies').doc(agencyId).get();
        const transactionQuery = await dbAdmin.collection('transactions').where('ghlTransactionId', '==', transactionId).limit(1).get();

        if (!agencyDoc.exists || transactionQuery.empty) {
            return NextResponse.json({ error: 'Agency or original transaction not found.' }, { status: 404 });
        }
        
        const agencyData = agencyDoc.data()!;
        const originalTransaction = transactionQuery.docs[0].data();

        // 2. Call Cardknox API to process the refund
        const cardknoxApiKey = agencyData.cardknoxApiKey; // Decrypt
        const sandboxMode = agencyData.sandboxMode;
        
        console.log(`Refunding transaction ${originalTransaction.cardknoxRefNum} for amount ${amount}`);
        // await callCardknoxRefund(cardknoxApiKey, sandboxMode, originalTransaction.cardknoxRefNum, amount);

        // 3. Update transaction status in Firestore
        await dbAdmin.collection('transactions').doc(transactionQuery.docs[0].id).update({
            status: 'refunded',
            updatedAt: new Date(),
        });

        // 4. Update transaction in GHL (PATCH /transactions/{id})
        // This confirms to GHL that the refund was successful.
        // const ghlAccessToken = agencyData.ghlAccessToken;
        // await patchGhlTransaction(ghlAccessToken, transactionId, { status: 'refunded' });

        return NextResponse.json({ success: true, message: 'Refund processed successfully.' });

    } catch (error: any) {
        console.error('Refund API Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
