import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Droplets, Wind, Sparkles } from "lucide-react";

const onProcessOrders = [
  {
    id: "25-0016",
    customer: "John Doe",
    service: "Wash + Fold",
    weight: "5 kg",
    stage: "Washing",
  },
  {
    id: "25-0014",
    customer: "Sarah Johnson",
    service: "Premium Hand Wash",
    weight: "3 kg",
    stage: "Drying",
  },
  {
    id: "25-0012",
    customer: "Mike Chen",
    service: "Express Wash",
    weight: "4 kg",
    stage: "Folding",

  },
  {
    id: "25-0010",
    customer: "Emma Wilson",
    service: "Dry Cleaning",
    weight: "2 kg",
    stage: "Quality Check",
  },
  {
    id: "25-0008",
    customer: "David Lee",
    service: "Wash + Iron",
    weight: "6 kg",
    stage: "Washing",
  },
];

const stageIcons = {
  Washing: Droplets,
  Drying: Wind,
  Folding: Sparkles,
  "Quality Check": Clock,
};

const stageColors = {
  Washing: "text-blue-600 bg-blue-50",
  Drying: "text-orange-600 bg-orange-50",
  Folding: "text-purple-600 bg-purple-50",
  "Quality Check": "text-green-600 bg-green-50",
};

export default function OnProcess() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) {
      return onProcessOrders;
    }
    return onProcessOrders.filter((order) => {
      const term = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.service.toLowerCase().includes(term) ||
        order.stage.toLowerCase().includes(term)
      );
    });
  }, [searchTerm]);

  return (
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
            <h1 className="text-2xl font-bold text-gray-900">On Process</h1>
            <p className="text-sm text-gray-500">Track orders currently being processed</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Orders in progress</h1>
                <p className="text-sm text-gray-500">Real-time tracking of your laundry orders.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by ID, customer, service, or stage"
                className="bg-slate-50"
              />
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>
                  Showing {filteredOrders.length} of {onProcessOrders.length} orders
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
                    <th className="py-3">Weight</th>
                    <th className="py-3">Stage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredOrders.map((order) => {
                    const StageIcon = stageIcons[order.stage];
                    return (
                      <tr key={order.id}>
                        <td className="py-4 font-semibold text-gray-900">{order.id}</td>
                        <td className="py-4">{order.customer}</td>
                        <td className="py-4">{order.service}</td>
                        <td className="py-4">{order.weight}</td>
                        <td className="py-4">
                          <Badge className={`${stageColors[order.stage]} font-medium border-0`}>
                            <StageIcon className="h-3 w-3 mr-1" />
                            {order.stage}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 md:hidden">
              {filteredOrders.map((order) => {
                const StageIcon = stageIcons[order.stage];
                return (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-400">Laundry ID</p>
                        <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                      </div>
                      <Badge className={`${stageColors[order.stage]} font-medium border-0`}>
                        <StageIcon className="h-3 w-3 mr-1" />
                        {order.stage}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-500">
                        {order.service} · {order.weight}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


