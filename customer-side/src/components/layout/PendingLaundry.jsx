import { useMemo, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import CustomerHeader from "./CustomerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Package2, Loader2 } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

const statusStyles = {
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  "Awaiting Pickup": "bg-yellow-50 text-yellow-700 border-yellow-200",
  Scheduled: "bg-blue-50 text-blue-700 border-blue-200",
};

const priorityStyles = {
  Normal: "bg-gray-50 text-gray-700 border-gray-200",
  Express: "bg-red-50 text-red-700 border-red-200",
};

export default function PendingLaundry() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customerData } = useContext(AuthContext);

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        // Temporary mock data
        const mockOrders = [
          {
            id: 1,
            laundry_id: "25-0020",
            service_name: "Wash + Fold",
            weight: 7,
            bags: 2,
            status: "Pending",

          },
          {
            id: 2,
            laundry_id: "25-0019",
            service_name: "Premium Hand Wash",
            weight: 4,
            bags: 1,
            status: "Pending",
          },
          {
            id: 3,
            laundry_id: "25-0018",
            service_name: "Dry Cleaning",
            weight: 3,
            bags: 1,
            status: "Pending",
          },
          {
            id: 4,
            laundry_id: "25-0017",
            service_name: "Express Wash",
            weight: 5,
            bags: 2,
            status: "Pending",
          },
          {
            id: 5,
            laundry_id: "25-0016",
            service_name: "Wash + Iron",
            weight: 6,
            bags: 2,
            status: "Pending",
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
          `/api/customers/orders/${customerData.id}/${customerData.shop_id}?status=Pending`
        );

        if (res.success) {
          setOrders(res.data || []);
        } else {
          toast.error("Failed to load pending orders");
        }
        */
      } catch (error) {
        console.error("Error fetching pending orders:", error);
        toast.error("Error loading pending orders");
        setLoading(false);
      }
    };

    fetchPendingOrders();
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
        order.status?.toLowerCase().includes(term) ||
        order.address?.toLowerCase().includes(term)
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
            <h1 className="text-2xl font-bold text-gray-900">Pending Laundry</h1>
            <p className="text-sm text-gray-500">Orders awaiting pickup or scheduled</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pending laundry orders</h1>
                <p className="text-sm text-gray-500">
                  Track orders waiting for pickup or scheduled for collection.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by ID, service, or address"
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
                <Package2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">
                  {searchTerm ? "No orders found matching your search" : "No pending laundry orders"}
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
                        <th className="py-3">Pickup Date</th>
                        <th className="py-3">Address</th>
                        <th className="py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-4 font-semibold text-gray-900">
                            {order.laundry_id || `#${order.id}`}
                          </td>
                          <td className="py-4">{order.service_name || "N/A"}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              <Package2 className="h-4 w-4 text-gray-400" />
                              <span>
                                {order.weight ? `${order.weight} kg` : "N/A"} · {order.bags || 0}{" "}
                                bag{order.bags !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="flex items-start gap-1.5">
                              <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  {order.pickup_date
                                    ? new Date(order.pickup_date).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "Not scheduled"}
                                </p>
                                {order.pickup_time && (
                                  <p className="text-xs text-gray-500">{order.pickup_time}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <p className="text-xs text-gray-500">{order.address || "N/A"}</p>
                          </td>
                          <td className="py-4">
                            <Badge
                              className={`${
                                statusStyles[order.status] || statusStyles.Pending
                              } font-medium`}
                            >
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
                            statusStyles[order.status] || statusStyles.Pending
                          } font-medium`}
                        >
                          {order.status}
                        </Badge>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.service_name || "N/A"}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{order.address || "N/A"}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Package2 className="h-4 w-4 text-gray-400" />
                        <span>
                          {order.weight ? `${order.weight} kg` : "N/A"} · {order.bags || 0} bag
                          {order.bags !== 1 ? "s" : ""}
                        </span>
                      </div>

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
