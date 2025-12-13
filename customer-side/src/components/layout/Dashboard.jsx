import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingBasket, CreditCard, Truck, Droplets, Clock, CheckCircle2, Package } from "lucide-react"
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
  const [readyToPickUp, setReadyToPickUp] = useState(0);
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
    const fetchReadyToPickUpOrders = async () => {
      try {
        if (!customerData) return;
        const res = await fetchApi(`/api/customers/total-RTPU-count/${customerData.id}/${customerData.shop_id}`);

        if (res.success) {
          setReadyToPickUp(res.data)
        }
      } catch (error) {
        console.error("Error fetching total Ready to pick-up count:", error);
      }

    }
    fetchMonthTotal();
    fetchReadyToPickUpOrders();
  }, [customerData]);


  const quickStats = [
    {
      label: "Ready for pick-up",
      value: `${readyToPickUp.toLocaleString()} bags`,
      action: "See details",
      icon: ShoppingBasket,
      accent: "bg-sky-100 text-sky-700",
      path: "/dashboard/ready-pickup"
    },
    {
      label: "Pending Payment",
      value: "2 Bags",
      action: "Pay",
      icon: CreditCard,
      accent: "bg-emerald-100 text-emerald-700",
      path: "/dashboard/pending-payments"
    },
    {
      label: "On Process",
      value: "2 Bags",
      action: "View Details",
      icon: Truck,
      accent: "bg-indigo-100 text-indigo-700",
      path: "/dashboard/on-process"
    },
     {
      label: "Pending Laundry",
      value: "2 Bags",
      action: "View Details",
      icon: Truck,
      accent: "bg-indigo-100 text-indigo-700",
      path: "/dashboard/pending-laundry"
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

  const activityLogs = [
    {
      id: "25-0015",
      action: "Payment Received",
      description: "GCash payment confirmed for Wash + Fold service",
      timestamp: "2 hours ago",
      icon: CheckCircle2,
      iconColor: "text-green-600"
    },
    {
      id: "25-0014",
      action: "Order Completed",
      description: "Premium Hand Wash ready for pickup",
      timestamp: "5 hours ago",
      icon: Package,
      iconColor: "text-sky-600"
    },
    {
      id: "25-0013",
      action: "Order In Progress",
      description: "Express Wash currently in drying stage",
      timestamp: "1 day ago",
      icon: Clock,
      iconColor: "text-orange-600"
    },
    {
      id: "25-0012",
      action: "Payment Pending",
      description: "Awaiting payment confirmation for Dry Cleaning",
      timestamp: "2 days ago",
      icon: CreditCard,
      iconColor: "text-amber-600"
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

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
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
                <h2 className="text-lg font-semibold text-gray-900">Activity Logs</h2>
                <p className="text-sm text-gray-500">Recent updates and transactions</p>
              </div>
            </div>

            <div className="space-y-3">
              {activityLogs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-slate-100 p-4 flex gap-4 bg-white hover:border-slate-200 transition">
                  <div className={`flex-shrink-0 ${log.iconColor}`}>
                    <log.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                        <p className="text-sm text-gray-500 mt-1">{log.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">ID: {log.id}</p>
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


