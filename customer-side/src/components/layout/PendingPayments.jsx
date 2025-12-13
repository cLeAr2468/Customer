import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ListChecks, ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const pendingPayments = [
  {
    id: "25-0015",
    customer: "Alexa Cruz",
    service: "Wash + Fold",
    amount: "₱450",
    status: "Pending",
    gcashReceipt: "https://via.placeholder.com/400x600/0066FF/FFFFFF?text=Gcash+Receipt+25-0015",
  },
  {
    id: "25-0013",
    customer: "Miguel Santos",
    service: "Premium Hand Wash",
    amount: "₱720",
    status: "Pending",
    gcashReceipt: null,
  },
  {
    id: "25-0011",
    customer: "James Patterson",
    service: "Express Wash",
    amount: "₱280",
    status: "Pending",
    gcashReceipt: "https://via.placeholder.com/400x600/0066FF/FFFFFF?text=Gcash+Receipt+25-0011",
  },
  {
    id: "25-0009",
    customer: "Maria Garcia",
    service: "Dry Cleaning",
    amount: "₱350",
    status: "Pending",
    gcashReceipt: null,
  },
  {
    id: "25-0007",
    customer: "Rina Lopez",
    service: "Express Wash",
    amount: "₱280",
    status: "Pending",
    gcashReceipt: "https://via.placeholder.com/400x600/0066FF/FFFFFF?text=Gcash+Receipt+25-0007",
  },
];

const statusStyles = {
  Pending: "bg-orange-50 text-orange-700",
  "Partially Paid": "bg-yellow-50 text-yellow-700",
  Overdue: "bg-red-50 text-red-700",
};

export default function PendingPayments() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleViewPayment = (payment) => {
    navigate("/dashboard/payment", { state: { payment } });
  };

  const filteredPayments = useMemo(() => {
    if (!searchTerm.trim()) {
      return pendingPayments;
    }
    return pendingPayments.filter((payment) => {
      const term = searchTerm.toLowerCase();
      return (
        payment.id.toLowerCase().includes(term) ||
        payment.customer.toLowerCase().includes(term) ||
        payment.service.toLowerCase().includes(term)
      );
    });
  }, [searchTerm]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl space-y-6">
          <CustomerHeader />

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pending Payments</h1>
            <p className="text-sm text-gray-500">Manage customer payments</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pending payments</h1>
                <p className="text-sm text-gray-500">Manage and process customer payments.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by ID, customer, or service"
                className="bg-slate-50"
              />
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>
                  Showing {filteredPayments.length} of {pendingPayments.length} payments
                </span>
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="text-xs uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="py-3">Laundry ID</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Service</th>
                    <th className="py-3">Amount</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-4 font-semibold text-gray-900">{payment.id}</td>
                      <td className="py-4">{payment.customer}</td>
                      <td className="py-4">{payment.service}</td>
                      <td className="py-4 font-semibold text-gray-900">{payment.amount}</td>
                      <td className="py-4">
                        <Badge
                          className={`${statusStyles[payment.status]} font-medium bg-white text-orange-500`}
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-right space-x-4">
                        <Tooltip>
                          <TooltipTrigger>
                            <ListChecks
                              onClick={() => handleViewPayment(payment)}
                              className="cursor-pointer text-sm"
                            />
                          </TooltipTrigger>
                          <TooltipContent>Process</TooltipContent>
                        </Tooltip>  
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {filteredPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-2xl border border-slate-100 bg-white p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">Laundry ID</p>
                      <p className="text-lg font-semibold text-gray-900">{payment.id}</p>
                    </div>
                    <Badge
                      className={`${statusStyles[payment.status]} font-medium bg-white text-orange-500`}
                    >
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-gray-900">{payment.customer}</p>
                  <p className="text-sm text-gray-500">
                    {payment.service} · {payment.amount}
                  </p>
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      onClick={() => handleViewPayment(payment)}
                      className="mt-3 w-full bg-sky-600 hover:bg-sky-700 self-stretch md:self-auto"
                    >
                      Process Payment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </TooltipProvider>
  );
}
