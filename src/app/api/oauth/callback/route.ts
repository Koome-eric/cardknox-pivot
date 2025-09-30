import { NextResponse, type NextRequest } from 'next/server';
import { dbAdmin } from '@/lib/firebase/admin';
import { GHL_API_BASE_URL } from '@/lib/config';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const locationId = searchParams.get('locationId'); // GHL may return this

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not found.' }, { status: 400 });
  }

  const clientId = process.env.GHL_CLIENT_ID;
  const clientSecret = process.env.GHL_CLIENT_SECRET;
  const redirectUri = process.env.GHL_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: 'OAuth credentials are not configured.' }, { status: 500 });
  }
  
  try {
    // 1. Exchange authorization code for tokens
    const tokenResponse = await fetch(`${GHL_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
        const errorBody = await tokenResponse.text();
        console.error("GHL Token Exchange Error:", errorBody);
        throw new Error('Failed to exchange authorization code for tokens.');
    }

    const tokens = await tokenResponse.json();
    const agencyId = tokens.locationId || locationId;

    if (!agencyId) {
        throw new Error("Could not determine the location/agency ID from GHL's response.");
    }
    
    // 2. (Optional) Fetch agency/location details to get name
    // For now, we'll just use the ID as the name placeholder
    const agencyName = `Agency ${agencyId}`;

    // 3. Encrypt tokens before storing (conceptual)
    // In a real app, you would use a KMS or similar service.
    // For this scaffold, we store them as is, but structure for future encryption.
    const accessTokenEncrypted = tokens.access_token;
    const refreshTokenEncrypted = tokens.refresh_token;

    // 4. Save agency data to Firestore
    const agencyRef = dbAdmin.collection('agencies').doc(agencyId);
    
    const agencyData = {
      id: agencyId,
      name: agencyName,
      ghlAccessToken: accessTokenEncrypted,
      ghlRefreshToken: refreshTokenEncrypted,
      ghlTokenExpiresAt: Timestamp.fromMillis(Date.now() + tokens.expires_in * 1000),
      sandboxMode: true, // Default to sandbox
      updatedAt: Timestamp.now(),
    };

    await agencyRef.set({
      ...agencyData,
      createdAt: Timestamp.now(),
    }, { merge: true });

    // 5. Redirect to the dashboard
    // It's better to redirect to a page that shows a success message
    // and then redirects to the dashboard to avoid state issues.
    const dashboardUrl = new URL('/dashboard', request.url);
    dashboardUrl.searchParams.set('status', 'install-success');
    
    return NextResponse.redirect(dashboardUrl);

  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    const errorUrl = new URL('/login', request.url);
    errorUrl.searchParams.set('error', 'oauth_failed');
    errorUrl.searchParams.set('message', error.message || 'An unknown error occurred during installation.');
    return NextResponse.redirect(errorUrl);
  }
}
