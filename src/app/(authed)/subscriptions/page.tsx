import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle } from "lucide-react";

const mockSubscriptions = [
    { id: 'sub_1', contact: 'John Doe', status: 'active', amount: 49.99, schedule: 'Monthly', nextBill: '2023-11-15' },
    { id: 'sub_2', contact: 'Jane Smith', status: 'canceled', amount: 99.00, schedule: 'Yearly', nextBill: '-' },
    { id: 'sub_3', contact: 'Peter Jones', status: 'past_due', amount: 19.99, schedule: 'Monthly', nextBill: '2023-10-20' },
    { id: 'sub_4', contact: 'Mary Williams', status: 'active', amount: 25.50, schedule: 'Monthly', nextBill: '2023-11-01' },
];

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subscriptions</CardTitle>
            <CardDescription>
              Manage recurring payments for your customers.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Subscription
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Next Billing</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSubscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell className="font-medium">{sub.contact}</TableCell>
                  <TableCell>
                    <Badge variant={sub.status === 'active' ? 'default' : sub.status === 'past_due' ? 'destructive' : 'secondary'} className="capitalize bg-green-500">{sub.status}</Badge>
                  </TableCell>
                  <TableCell>{sub.schedule}</TableCell>
                  <TableCell className="text-right">${sub.amount.toFixed(2)}</TableCell>
                  <TableCell>{sub.nextBill}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
