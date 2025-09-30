import { NextResponse } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';
import { GHL_API_BASE_URL } from '@/lib/config';

// This is a placeholder function to get the current user and their agencyId
// In a real app, this would be derived from the session cookie
async function getAgencyIdFromSession(request: Request): Promise<string> {
  // Logic to verify session and get user/agency data
  // For now, we'll extract it from the request if sent, or use a placeholder
  const body = await request.json();
  if (body.agencyId) return body.agencyId;
  throw new Error("Agency ID not found.");
}


export async function POST(request: Request) {
  try {
    const agencyId = await getAgencyIdFromSession(request);
    const agencyDoc = await dbAdmin.collection('agencies').doc(agencyId).get();

    if (!agencyDoc.exists) {
      return NextResponse.json({ error: 'Agency not found or not configured.' }, { status: 404 });
    }

    const agencyData = agencyDoc.data();
    // TODO: Implement token refresh logic if needed
    const accessToken = agencyData?.ghlAccessToken;
    
    if (!accessToken) {
        return NextResponse.json({ error: 'GHL access token not found.' }, { status: 401 });
    }

    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

    const providerPayload = {
      displayName: "Cardknox Payments",
      name: "cardknox",
      configurationFields: [
        { key: "cardknoxApiKey", type: "string", required: true, label: "Cardknox API Key" },
        { key: "sandboxMode", type: "boolean", required: true, label: "Enable Sandbox Mode" }
      ],
      supportedMethods: [
        "cc:sale",
        "cc:authonly",
        "capture",
        "refund",
        "void",
        "subscription:create",
        "subscription:cancel"
      ],
      actionHooks: {
        'cc:sale': `${baseUrl}/api/payments/sale`,
        'refund': `${baseUrl}/api/payments/refund`,
        'void': `${baseUrl}/api/payments/void`,
        'subscription:create': `${baseUrl}/api/subscriptions/create`,
        'subscription:cancel': `${baseUrl}/api/subscriptions/cancel`,
        // 'capture' and 'cc:authonly' would also be mapped here
      }
    };

    const response = await fetch(`${GHL_API_BASE_URL}/payments/custom-provider/register`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
        },
        body: JSON.stringify(providerPayload)
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("GHL Provider Registration Error:", errorBody);
        throw new Error(`GHL API Error: ${errorBody.message || 'Failed to register provider'}`);
    }

    const result = await response.json();
    const providerId = result.id;

    // Store the provider ID in Firestore
    await dbAdmin.collection('agencies').doc(agencyId).update({
      providerId: providerId,
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, providerId: providerId });

  } catch (error: any) {
    console.error('Register Provider Error:', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
