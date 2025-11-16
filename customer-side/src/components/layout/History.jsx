import CustomerHeader from "./CustomerHeader";
import { Card, CardContent } from "@/components/ui/card";

const monthlySummary = {
  totalBags: 18,
  totalSpent: "₱4,320",
  avgTurnaround: "17 hrs",
};

const historyItems = [
  {
    id: "25-0010",
    date: "Nov 14",
    service: "Regular Wash + Fold",
    amount: "₱350",
    status: "Completed",
  },
  {
    id: "25-0006",
    date: "Nov 09",
    service: "Premium Hand Wash",
    amount: "₱720",
    status: "Delivered",
  },
  {
    id: "25-0002",
    date: "Nov 02",
    service: "Express Wash",
    amount: "₱280",
    status: "Completed",
  },
];

export default function History() {
  const orderedHistory = [...historyItems].sort((a, b) => {
    const parseDate = (entry) => new Date(`${entry.date} ${new Date().getFullYear()}`);
    return parseDate(a) - parseDate(b);
  });

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <CustomerHeader />
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {orderedHistory.map((item) => (
                <div key={item.id} className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">{item.date}</p>
                    <p className="text-lg font-semibold text-gray-900">{item.service}</p>
                    <p className="text-sm text-gray-500">Laundry ID · {item.id}</p>
                  </div>
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <p className="text-base font-semibold text-gray-900">{item.amount}</p>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
