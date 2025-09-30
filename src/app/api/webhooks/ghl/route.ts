import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';

export async function POST(request: Request) {
    try {
        // GHL webhook verification would happen here
        const payload = await request.json();
        const { type, locationId } = payload;

        console.log(`Received GHL webhook: ${type} for location ${locationId}`);

        switch (type) {
            case 'App/Uninstalled':
            case 'Token/Revoked':
                if (locationId) {
                    // Mark the agency as disconnected in Firestore
                    const agencyRef = dbAdmin.collection('agencies').doc(locationId);
                    await agencyRef.update({
                        ghlAccessToken: null, // Clear tokens
                        ghlRefreshToken: null,
                        updatedAt: new Date(),
                    });
                    console.log(`Deactivated agency ${locationId} due to app uninstallation or token revocation.`);
                    
                    // TODO: Send notification to admin
                }
                break;
            
            // Handle other GHL events as needed

            default:
                console.log(`Unhandled GHL webhook type: ${type}`);
        }

        return NextResponse.json({ success: true, message: 'Webhook received.' });

    } catch (error: any) {
        console.error('GHL Webhook Error:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}
