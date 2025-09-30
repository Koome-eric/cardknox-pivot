'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  LayoutDashboard,
  CreditCard,
  Repeat,
  LogOut,
  LifeBuoy,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/subscriptions', label: 'Subscriptions', icon: Repeat },
];

const pageTitles: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/payments': 'Payments',
    '/subscriptions': 'Subscriptions',
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/login');
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
       <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold md:text-base font-headline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="M12 22v-8" />
            <path d="M6 14v-4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v4" />
            <path d="M18 10V8a2 2 0 0 0-2-2h-4L8 2" />
            <path d="m6 14 3 3 3-3" />
          </svg>
          <span className="sr-only">Transactify</span>
        </Link>
        <h1 className="text-xl font-semibold font-headline">{pageTitles[pathname] || 'Transactify GHL'}</h1>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full max-h-screen flex-col">
            <div className="flex h-16 items-center border-b px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold font-headline">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                >
                    <path d="M12 22v-8" />
                    <path d="M6 14v-4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v4" />
                    <path d="M18 10V8a2 2 0 0 0-2-2h-4L8 2" />
                    <path d="m6 14 3 3 3-3" />
                </svg>
                <span>Transactify</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="grid gap-2 p-4 text-lg font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto border-t p-4 space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3">
                    <LifeBuoy className="h-4 w-4" />
                    Support
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
