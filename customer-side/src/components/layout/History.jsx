import { useContext, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CustomerHeader from "./CustomerHeader";
import { AuthContext } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";

export default function History() {
  const { customerData } = useContext(AuthContext);
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "short", day: "2-digit" });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!customerData) return;
        const res = await fetchApi(
          `/api/customers/get-customer-record/${customerData.shop_id}/${customerData.id}`
        );

        if (!res.success) {
          setHistoryItems([]);
          setLoading(false);
          return;
        }

        const formatted = res.data.map((item) => ({
          id: item.laundryId,
          date: formatDate(item.created_at),
          service: item.service.replace(/,/g, " +"),
          amount: `₱${item.total_amount}`,
          status: item.status === "Laundry Done" ? "Completed" : item.status,
        }));

        // Sort by date descending (latest first)
        const ordered = [...formatted].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setHistoryItems(ordered);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching customer history:", err);
        setHistoryItems([]);
        setLoading(false);
      }
    };

    fetchHistory();
  }, [customerData]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <CustomerHeader />

        <Card className="shadow-sm">
          <CardContent className="p-0">
            {loading ? (
              <p className="text-center py-6 text-gray-500 text-sm">
                Loading history...
              </p>
            ) : historyItems.length === 0 ? (
              <p className="text-center py-6 text-gray-500 text-sm">
                No history found.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {historyItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-400">
                        {item.date}
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {item.service}
                      </p>
                      <p className="text-sm text-gray-500">
                        Laundry ID · {item.id}
                      </p>
                    </div>
                    <div className="flex flex-col items-start gap-1 sm:items-end">
                      <p className="text-base font-semibold text-gray-900">
                        {item.amount}
                      </p>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
