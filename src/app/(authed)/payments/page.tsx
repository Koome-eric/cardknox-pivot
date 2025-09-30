"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function PaymentsPage() {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [amount, setAmount] = useState("10.00");
  const [contactId, setContactId] = useState("contact_test_123");
  const [agencyId, setAgencyId] = useState("agency_test_456"); // This would come from auth

  const initializeIframe = () => {
    if (iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage({
            type: 'INIT_PAYMENT',
            amount: amount,
            contactId: contactId,
            agencyId: agencyId,
        }, '*');
    }
  }

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
        if (event.data.type === 'PAYMENT_SUCCESS') {
            toast({
                title: "Payment Successful (from Parent)",
                description: `Transaction ID: ${event.data.transaction.ghlTransactionId}`,
            });
        } else if (event.data.type === 'PAYMENT_ERROR') {
             toast({
                variant: 'destructive',
                title: "Payment Failed (from Parent)",
                description: event.data.error,
            });
        }
    };

    window.addEventListener('message', handleIframeMessage);

    return () => {
        window.removeEventListener('message', handleIframeMessage);
    };
  }, [toast]);


  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Payment</CardTitle>
              <CardDescription>
                Use this form to simulate a customer checkout. The payment form below is in a secure iframe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g., 29.99"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactId">GHL Contact ID</Label>
                <Input
                  id="contactId"
                  value={contactId}
                  onChange={(e) => setContactId(e.target.value)}
                  placeholder="GHL Contact ID"
                />
              </div>
            </CardContent>
            <CardFooter>
                <Button onClick={initializeIframe}>Load Payment Details into Iframe</Button>
            </CardFooter>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Secure Payment Form</CardTitle>
            </CardHeader>
            <CardContent>
              <iframe
                ref={iframeRef}
                src="/payment-iframe.html"
                title="Secure Payment Form"
                className="w-full h-80 border rounded-md"
                onLoad={initializeIframe}
              ></iframe>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
