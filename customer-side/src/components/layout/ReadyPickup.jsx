import { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, MapPin, Clock, Loader2, CheckCircle2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

const statusStyles = {
  "Ready to Pick-up": "bg-green-50 text-green-700 border-green-200",
  "Ready for Pickup": "bg-green-50 text-green-700 border-green-200",
  Completed: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function ReadyPickup() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customerData } = useContext(AuthContext);

  useEffect(() => {
    const fetchReadyOrders = async () => {
      try {
        // Temporary mock data
        const mockOrders = [
          {
            id: 1,
            laundry_id: "25-0025",
            service_name: "Wash + Fold",
            weight: 5,
            bags: 2,
            status: "Ready to Pick-up",
            completed_date: "2025-12-13",
            pickup_location: "Main Branch - 123 Laundry St",
            total_amount: 450,
            notes: "Folded and packed",
          },
          {
            id: 2,
            laundry_id: "25-0024",
            service_name: "Premium Hand Wash",
            weight: 3,
            bags: 1,
            status: "Ready to Pick-up",
            completed_date: "2025-12-13",
            pickup_location: "Main Branch - 123 Laundry St",
            total_amount: 720,
            notes: "Delicate items handled with care",
          },
          {
            id: 3,
            laundry_id: "25-0023",
            service_name: "Dry Cleaning",
            weight: 2,
            bags: 1,
            status: "Ready to Pick-up",
            completed_date: "2025-12-12",
            pickup_location: "Main Branch - 123 Laundry St",
            total_amount: 350,
            notes: "Suits and formal wear",
          },
          {
            id: 4,
            laundry_id: "25-0022",
            service_name: "Express Wash",
            weight: 4,
            bags: 1,
            status: "Ready to Pick-up",
            completed_date: "2025-12-13",
            pickup_location: "Main Branch - 123 Laundry St",
            total_amount: 280,
            notes: "Express service completed",
          },
        ];

        // Simulate API delay
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 500);

        // Uncomment below to use real API
        /*
        if (!customerData) {
          setLoading(false);
          return;
        }

        const res = await fetchApi(
          `/api/customers/orders/${customerData.id}/${customerData.shop_id}?status=Ready to Pick-up`
        );

        if (res.success) {
          setOrders(res.data || []);
        } else {
          toast.error("Failed to load ready orders");
        }
        */
      } catch (error) {
        console.error("Error fetching ready orders:", error);
        toast.error("Error loading ready orders");
        setLoading(false);
      }
    };

    fetchReadyOrders();
  }, [customerData]);

  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) {
      return orders;
    }
    return orders.filter((order) => {
      const term = searchTerm.toLowerCase();
      return (
        order.id?.toString().toLowerCase().includes(term) ||
        order.laundry_id?.toLowerCase().includes(term) ||
        order.service_name?.toLowerCase().includes(term) ||
        order.pickup_location?.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, orders]);

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
            <h1 className="text-2xl font-bold text-gray-900">Ready for Pick-up</h1>
            <p className="text-sm text-gray-500">Your completed orders ready for collection</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Ready for collection</h1>
                <p className="text-sm text-gray-500">
                  Orders completed and waiting for you to pick up.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by ID, service, or location"
                className="bg-slate-50"
                disabled={loading}
              />
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>
                  Showing {filteredOrders.length} of {orders.length} orders
                </span>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm
                    ? "No orders found matching your search"
                    : "No orders ready for pickup"}
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="text-xs uppercase tracking-wide text-gray-400">
                      <tr>
                        <th className="py-3">Laundry ID</th>
                        <th className="py-3">Service</th>
                        <th className="py-3">Weight/Bags</th>
                        <th className="py-3">Completed</th>
                        <th className="py-3">Pickup Location</th>
                        <th className="py-3">Amount</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition">
                          <td className="py-4 font-semibold text-gray-900">
                            {order.laundry_id || `#${order.id}`}
                          </td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-900">{order.service_name || "N/A"}</p>
                              {order.notes && (
                                <p className="text-xs text-gray-500">{order.notes}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-400" />
                              <span>
                                {order.weight ? `${order.weight} kg` : "N/A"} · {order.bags || 0}{" "}
                                bag{order.bags !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>
                                {order.completed_date
                                  ? new Date(order.completed_date).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-start gap-1.5">
                              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                              <span className="text-xs">{order.pickup_location || "N/A"}</span>
                            </div>
                          </td>
                          <td className="py-4 font-semibold text-gray-900">
                            ₱{order.total_amount?.toLocaleString() || "0"}
                          </td>
                          <td className="py-4">
                            <Badge
                              className={`${
                                statusStyles[order.status] || statusStyles["Ready to Pick-up"]
                              } font-medium`}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {order.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3 md:hidden">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-slate-100 bg-white p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-400">
                            Laundry ID
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {order.laundry_id || `#${order.id}`}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            statusStyles[order.status] || statusStyles["Ready to Pick-up"]
                          } font-medium`}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Ready
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.service_name || "N/A"}
                        </p>
                        {order.notes && (
                          <p className="text-xs text-gray-500 mt-0.5">{order.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span>
                            {order.weight ? `${order.weight} kg` : "N/A"} · {order.bags || 0} bag
                            {order.bags !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="font-semibold text-gray-900">
                          ₱{order.total_amount?.toLocaleString() || "0"}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>
                            Completed:{" "}
                            {order.completed_date
                              ? new Date(order.completed_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <span>{order.pickup_location || "N/A"}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => navigate("/dashboard/payment", { state: { order } })}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Pick Up & Pay
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
