import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';

// This would be the action hook called by GHL when a user clicks "Void"
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transactionId, agencyId } = body; 

        if (!transactionId || !agencyId) {
            return NextResponse.json({ error: 'Missing void details.' }, { status: 400 });
        }

        // 1. Fetch agency config and original transaction
        const agencyDoc = await dbAdmin.collection('agencies').doc(agencyId).get();
        const transactionQuery = await dbAdmin.collection('transactions').where('ghlTransactionId', '==', transactionId).limit(1).get();

        if (!agencyDoc.exists || transactionQuery.empty) {
            return NextResponse.json({ error: 'Agency or original transaction not found.' }, { status: 404 });
        }
        
        const agencyData = agencyDoc.data()!;
        const originalTransaction = transactionQuery.docs[0].data();

        // 2. Call Cardknox API to void the transaction
        const cardknoxApiKey = agencyData.cardknoxApiKey; // Decrypt
        const sandboxMode = agencyData.sandboxMode;
        
        console.log(`Voiding transaction ${originalTransaction.cardknoxRefNum}`);
        // await callCardknoxVoid(cardknoxApiKey, sandboxMode, originalTransaction.cardknoxRefNum);
        
        // 3. Update transaction status in Firestore
        await dbAdmin.collection('transactions').doc(transactionQuery.docs[0].id).update({
            status: 'voided',
            updatedAt: new Date(),
        });

        // 4. Update transaction in GHL (PATCH /transactions/{id})
        // const ghlAccessToken = agencyData.ghlAccessToken;
        // await patchGhlTransaction(ghlAccessToken, transactionId, { status: 'voided' });

        return NextResponse.json({ success: true, message: 'Transaction voided successfully.' });

    } catch (error: any) {
        console.error('Void API Error:', error);
        return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
    }
}
