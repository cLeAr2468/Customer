import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBasket, CreditCard, Truck, Droplets } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CustomerHeader from "./CustomerHeader"
import { fetchApi } from "@/lib/api"
import { AuthContext } from "@/context/AuthContext"

export default function LaundryDashboard() {
  const navigate = useNavigate();
  const [selectedStars, setSelectedStars] = useState(new Set());
  const [hoveredRating, setHoveredRating] = useState(0);
  const [monthTotal, setMonthTotal] = useState(0);
    const { customerData } = useContext(AuthContext);

  useEffect(() => {
    const fetchMonthTotal = async () => {
      try {
        if (!customerData) return;
        const res = await fetchApi(`/api/customers/total-amount/${customerData.id}/${customerData.shop_id}`);

        if (res.success) {
          setMonthTotal(res.data);
        }
      } catch (error) {
        console.error("Error fetching monthly total:", error);
      }
    }
    fetchMonthTotal();
  }, [customerData]);


  const quickStats = [
    {
      label: "Ready for pick-up",
      value: "2 bags",
      action: "See details",
      icon: ShoppingBasket,
      accent: "bg-sky-100 text-sky-700"
    },
    {
      label: "Payment status",
      value: "Pay Online",
      action: "Pay",
      icon: CreditCard,
      accent: "bg-emerald-100 text-emerald-700",
      path: "/dashboard/payment"
    },
    {
      label: "Next delivery",
      value: "Today · 5:30 PM",
      action: "Track rider",
      icon: Truck,
      accent: "bg-indigo-100 text-indigo-700"
    },
    {
      label: "Total this month",
      value: `₱${monthTotal.toLocaleString()}`,
      action: "View history",
      icon: Droplets,
      accent: "bg-amber-100 text-amber-700",
      path: "/dashboard/history"
    }
  ];

  const activeOrders = [
    {
      id: "25-0001",
      items: "Regular Wash + Fold",
      status: "Drying",
      eta: "Ready in 30 min"
    },
    {
      id: "25-0004",
      items: "Premium Hand Wash",
      status: "Quality check",
      eta: "Today · 4:45 PM"
    }
  ];

  const handleStarClick = (starNumber) => {
    setSelectedStars(prev => {
      const newSelection = new Set();

      if (prev.size > 0 && Math.max(...prev) === starNumber) {
        return newSelection;
      }

      for (let i = 1; i <= starNumber; i++) {
        newSelection.add(i);
      }
      return newSelection;
    });
  };

  const handleStarHover = (starNumber) => {
    setHoveredRating(starNumber);
  };

  const rating = selectedStars.size;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <CustomerHeader />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat) => {
            const isInteractive = Boolean(stat.path);
            return (
              <Card
                key={stat.label}
                className={`shadow-sm ${isInteractive ? "cursor-pointer transition hover:shadow-md hover:-translate-y-0.5" : ""}`}
                onClick={() => isInteractive && navigate(stat.path)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${stat.accent}`}>
                    <stat.icon className="h-4 w-4" />
                    {stat.label}
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <button
                    type="button"
                    className="text-sm font-medium text-sky-600 hover:text-sky-700"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (stat.path) {
                        navigate(stat.path);
                      }
                    }}
                  >
                    {stat.action}
                  </button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Active orders</h2>
                <p className="text-sm text-gray-500">Track progress in real-time</p>
              </div>
              <Input placeholder="Track ID e.g. 25-0001" className="bg-slate-50" />
            </div>

            <div className="space-y-4">
              {activeOrders.map((order) => (
                <div key={order.id} className="rounded-2xl border border-slate-100 p-4 flex flex-col gap-3 sm:items-center sm:justify-between sm:flex-row bg-white">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">Laundry ID</p>
                    <p className="text-lg font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-500">{order.items}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-sky-600">{order.status}</p>
                    <p className="text-xs text-gray-500">{order.eta}</p>
                    <Button size="sm" className="mt-3 bg-sky-600 hover:bg-sky-700 w-full sm:w-auto">View timeline</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-gray-900">Rate your last service</h2>
              <p className="text-sm text-gray-500">Share feedback to unlock extra loyalty points</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((starNumber) => (
                <button
                  key={starNumber}
                  onClick={() => handleStarClick(starNumber)}
                  onMouseEnter={() => handleStarHover(starNumber)}
                  onMouseLeave={() => handleStarHover(0)}
                  className="rounded-lg border border-slate-200 p-2 transition hover:border-sky-200"
                >
                  <Star
                    className={`h-7 w-7 sm:h-8 sm:w-8 ${hoveredRating
                        ? starNumber <= hoveredRating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-slate-300"
                        : selectedStars.has(starNumber)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-slate-300"
                      }`}
                  />
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              {rating ? `You rated ${rating} star${rating !== 1 ? "s" : ""}. Tell us what we did well or what we can improve.` : "Tap a star to start your review."}
            </p>

            <Textarea placeholder="Write your comment here..." className="min-h-[120px]" />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">Your review helps us keep your garments fresh and crisp every time.</p>
              <Button className="bg-sky-600 hover:bg-sky-700" disabled={!rating}>Submit feedback</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
