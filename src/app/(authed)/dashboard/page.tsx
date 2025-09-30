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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle, Link as LinkIcon, AlertCircle } from "lucide-react";

// This is a server component, so we would fetch data here.
// For the scaffold, we'll use mock data.

const mockAgencyData = {
  isConnected: true,
  isProviderRegistered: false,
  cardknoxApiKey: "ck_sandbox_xxxxxx...",
  sandboxMode: true,
};

const mockTransactions = [
    { id: 'ghl_trx_1', cardknoxRef: 'ck_ref_abc1', status: 'succeeded', amount: 49.99, contact: 'John Doe', date: '2023-10-26' },
    { id: 'ghl_trx_2', cardknoxRef: 'ck_ref_def2', status: 'failed', amount: 99.00, contact: 'Jane Smith', date: '2023-10-26' },
    { id: 'ghl_trx_3', cardknoxRef: 'ck_ref_ghi3', status: 'refunded', amount: 19.99, contact: 'Peter Jones', date: '2023-10-25' },
    { id: 'ghl_trx_4', cardknoxRef: 'ck_ref_jkl4', status: 'succeeded', amount: 25.50, contact: 'Mary Williams', date: '2023-10-24' },
];


export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span className="text-muted-foreground">$</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <span className="text-muted-foreground">#</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <span className="text-muted-foreground">#</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12,234</div>
            <p className="text-xs text-muted-foreground">+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
             <span className="text-muted-foreground">#</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>A list of the most recent transactions processed.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockTransactions.map((tx) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium">{tx.contact}</TableCell>
                                    <TableCell>
                                        <Badge variant={tx.status === 'succeeded' ? 'default' : tx.status === 'failed' ? 'destructive' : 'secondary'} className="capitalize">{tx.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">${tx.amount.toFixed(2)}</TableCell>
                                    <TableCell>{tx.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Connection Status</CardTitle>
              <CardDescription>Status of your GoHighLevel integration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">GHL OAuth</span>
                </div>
                {mockAgencyData.isConnected ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" /> Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <XCircle className="mr-1 h-4 w-4" /> Disconnected
                  </Badge>
                )}
              </div>
               <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Provider</span>
                </div>
                {mockAgencyData.isProviderRegistered ? (
                  <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" /> Registered
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                     <AlertCircle className="mr-1 h-4 w-4" /> Not Registered
                  </Badge>
                )}
              </div>
            </CardContent>
             {!mockAgencyData.isProviderRegistered && (
                 <CardFooter>
                     <Button className="w-full">Register Provider</Button>
                 </CardFooter>
             )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Cardknox Settings</CardTitle>
              <CardDescription>Manage your Cardknox API credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                <Label htmlFor="cardknox-api-key">API Key</Label>
                <Input id="cardknox-api-key" type="password" defaultValue={mockAgencyData.cardknoxApiKey} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="sandbox-mode" className="font-medium">Sandbox Mode</Label>
                <Switch id="sandbox-mode" defaultChecked={mockAgencyData.sandboxMode} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Settings</Button>
            </CardFooter>
          </Card>

        </div>
      </div>
    </div>
  );
}
