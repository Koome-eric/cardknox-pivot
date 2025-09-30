import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        // 1. Verify webhook signature (highly recommended)
        // const signature = request.headers.get('cardknox-signature');
        const payload = await request.json();
        // if (!isValidSignature(payload, signature)) {
        //     return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
        // }

        const { event_type, data } = payload;
        const cardknoxRefNum = data.xRefNum;

        console.log(`Received Cardknox webhook: ${event_type}`);

        // 2. Find the transaction in Firestore
        const transactionQuery = await dbAdmin.collection('transactions').where('cardknoxRefNum', '==', cardknoxRefNum).limit(1).get();

        if (transactionQuery.empty) {
            console.warn(`Webhook for unknown transaction ${cardknoxRefNum} received.`);
            // Still return 200 to acknowledge receipt
            return NextResponse.json({ success: true, message: 'Webhook received for unknown transaction.' });
        }
        
        const transactionDoc = transactionQuery.docs[0];
        const transactionData = transactionDoc.data();
        let newStatus: string | null = null;
        
        // 3. Map Cardknox event to our internal status
        switch (event_type) {
            case 'transaction.succeeded':
                newStatus = 'succeeded';
                break;
            case 'transaction.failed':
                newStatus = 'failed';
                break;
            case 'transaction.refunded':
                newStatus = 'refunded';
                break;
            // Add other event types as needed
        }

        if (newStatus && newStatus !== transactionData.status) {
            // 4. Update Firestore
            await transactionDoc.ref.update({ status: newStatus, updatedAt: new Date() });

            // 5. Update GHL
            const agencyDoc = await dbAdmin.collection('agencies').doc(transactionData.agencyId).get();
            if (agencyDoc.exists) {
                const agencyData = agencyDoc.data()!;
                const ghlAccessToken = agencyData.ghlAccessToken; // Refresh if needed
                console.log(`Patching GHL transaction ${transactionData.ghlTransactionId} to status ${newStatus}`);
                // await patchGhlTransaction(ghlAccessToken, transactionData.ghlTransactionId, { status: newStatus });
            }
        }

        return NextResponse.json({ success: true, message: 'Webhook processed.' });

    } catch (error: any) {
        console.error('Cardknox Webhook Error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
