import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShieldCheck, Zap } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { GHL_OAUTH_BASE_URL, GHL_SCOPES } from "@/lib/config";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  const ghlClientId = process.env.GHL_CLIENT_ID;
  const ghlRedirectUri = process.env.GHL_REDIRECT_URI;

  const params = new URLSearchParams({
    response_type: 'code',
    redirect_uri: ghlRedirectUri || '',
    client_id: ghlClientId || '',
    scope: GHL_SCOPES,
  });

  const authorizationUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&redirect_uri=https%3A%2F%2Fcardknox.vercel.app&client_id=68495fa69d4312f7eae11260-mcl63186&scope=payments%2Forders.readonly+payments%2Forders.write+payments%2Fintegration.readonly+payments%2Fintegration.write+payments%2Ftransactions.readonly+payments%2Fsubscriptions.readonly+payments%2Fcoupons.readonly+payments%2Fcoupons.write+payments%2Fcustom-provider.readonly+payments%2Fcustom-provider.write+products.readonly+products.write+products%2Fprices.readonly+products%2Fprices.write+products%2Fcollection.readonly+products%2Fcollection.write`;


  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-primary"
            >
              <path d="M12 22v-8" />
              <path d="M6 14v- аспекты 4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v4" />
              <path d="M18 10V8a2 2 0 0 0-2-2h-4L8 2" />
              <path d="m6 14 3 3 3-3" />
            </svg>
            <h1 className="text-xl font-bold font-headline text-foreground">
              Transactify GHL
            </h1>
          </div>
          <Button asChild variant="ghost">
            <Link href="/login">Admin Login</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-foreground">
                The Ultimate Cardknox Payment Gateway for GoHighLevel
              </h2>
              <p className="text-lg text-muted-foreground">
                Unlock seamless, secure, and fully integrated payment processing within your GHL funnels. Transactify connects your Cardknox account to GHL, enabling sales, subscriptions, refunds, and more—all synced automatically.
              </p>
              <div className="pt-4">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold">
                  <Link href={authorizationUrl}>
                    <Zap className="mr-2 h-5 w-5" />
                    Install App in GHL
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden shadow-2xl">
                {heroImage && (
                    <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    data-ai-hint={heroImage.imageHint}
                    fill
                    className="object-cover"
                    priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
            </div>
          </div>
        </section>

        <section className="bg-card py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold font-headline">Why Choose Transactify?</h3>
              <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Our integration is built for agencies and businesses that demand reliability, security, and deep platform integration.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold font-headline mb-2">Effortless Integration</h4>
                <p className="text-muted-foreground">
                  One-click OAuth installation gets you set up in minutes. Configure your Cardknox keys and start accepting payments instantly.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold font-headline mb-2">PCI Compliant & Secure</h4>
                <p className="text-muted-foreground">
                  With our secure iframe checkout, sensitive card data never touches your server, simplifying PCI compliance and protecting your customers.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mx-auto mb-4">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h4 className="text-xl font-bold font-headline mb-2">Full Feature Parity</h4>
                <p className="text-muted-foreground">
                  Supports sales, refunds, voids, and subscriptions. All transactions are automatically synced with GHL contacts and reporting.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Transactify GHL. All rights reserved.</p>
      </footer>
    </div>
  );
}
