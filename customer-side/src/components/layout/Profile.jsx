import { useState, useEffect, useContext } from "react";
import CustomerHeader from "./CustomerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { fetchApi } from "@/lib/api";
import { AuthContext } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Profile() {
  const [details, setDetails] = useState([]);
  const [draftDetails, setDraftDetails] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { customerData } = useContext(AuthContext);

  const formatMemberSince = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        if (!customerData) return;

        const res = await fetchApi(
          `/api/customers/get-customer/${customerData.id}/${customerData.shop_id}/${customerData.role}`
        );
        const data = res.data;

        const formattedDetails = [
          {
            key: "fullName",
            label: "Full name",
            value: `${data.user_fName} ${data.user_mName} ${data.user_lName}`,
          },
          { key: "email", label: "Email", value: data.email },
          { key: "phone", label: "Phone", value: data.contactNum },
          { key: "address", label: "Delivery address", value: data.user_address },
          {
            key: "memberSince",
            label: "Member since",
            value: formatMemberSince(data.date_registered),
          },
          { key: "completedOrders", label: "Completed orders", value: "0" },
          { key: "preferredService", label: "Preferred service", value: "N/A" },
          { key: "paymentPreference", label: "Payment preference", value: "N/A" },
        ];

        setDetails(formattedDetails);
        setDraftDetails(formattedDetails);
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerData]);

  const startEditing = () => {
    setDraftDetails(details.map((detail) => ({ ...detail })));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftDetails(details.map((detail) => ({ ...detail })));
    setIsEditing(false);
  };

  const saveChanges = async () => {
    const success = await updateCustomer();

    if (success) {
      setDetails(draftDetails.map((detail) => ({ ...detail })));
      setIsEditing(false);
      toast.success("Profile updated successfully!")
    } else {
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const updateCustomer = async () => {
    try {
      const payload = {
        user_fName: draftDetails.find(d => d.key === "fullName")?.value.split(" ")[0] || "",
        user_mName: draftDetails.find(d => d.key === "fullName")?.value.split(" ")[1] || "",
        user_lName: draftDetails.find(d => d.key === "fullName")?.value.split(" ")[2] || "",
        user_address: draftDetails.find(d => d.key === "address")?.value || "",
        contactNum: draftDetails.find(d => d.key === "phone")?.value || "",
        email: draftDetails.find(d => d.key === "email")?.value || "",
      };

      const res = await fetchApi(
        `/api/customers/update-customer/${customerData.id}/${customerData.shop_id}/${customerData.role}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      return true;
    } catch (error) {
      console.error("Update failed:", error);
      return false;
    }
  };


  const handleInputChange = (key, value) => {
    setDraftDetails((prev) =>
      prev.map((detail) =>
        detail.key === key ? { ...detail, value } : detail
      )
    );
  };

  const visibleDetails = isEditing ? draftDetails : details;

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <CustomerHeader />

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile information
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your personal details and delivery preferences.
                </p>
              </div>

              {isEditing ? (
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    type="button"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                    onClick={saveChanges}
                  >
                    <Check className="h-4 w-4" />
                    Save changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={cancelEditing}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 w-full sm:w-auto"
                  onClick={startEditing}
                >
                  <Pencil className="h-4 w-4" />
                  Edit profile
                </Button>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {visibleDetails.map((detail) => (
                <div
                  key={detail.key}
                  className="rounded-xl border border-slate-100 bg-white p-4 space-y-1"
                >
                  <p className="text-xs uppercase tracking-wide text-gray-400">
                    {detail.label}
                  </p>

                  {isEditing ? (
                    <Input
                      value={detail.value}
                      onChange={(event) =>
                        handleInputChange(detail.key, event.target.value)
                      }
                      className="bg-slate-50"
                    />
                  ) : (
                    <p className="text-base font-medium text-gray-900">
                      {detail.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
