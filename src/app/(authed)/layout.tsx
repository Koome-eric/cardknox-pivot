import type { PropsWithChildren } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authAdmin } from '@/lib/firebase/admin';
import { SESSION_COOKIE_NAME } from '@/lib/config';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';

const getAuthUser = async () => {
  const sessionCookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!sessionCookie) {
    return null;
  }
  try {
    const decodedClaims = await authAdmin.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Auth error in layout:', error);
    return null;
  }
};

export default async function AuthedLayout({ children }: PropsWithChildren) {
  const user = await getAuthUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-background overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
