import { useState } from "react";
import CustomerHeader from "./CustomerHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";

const defaultProfileDetails = [
  { key: "fullName", label: "Full name", value: "Gabiana Angie" },
  { key: "email", label: "Email", value: "gabiana.angie@example.com" },
  { key: "phone", label: "Phone", value: "+63 917 123 4567" },
  { key: "address", label: "Delivery address", value: "Unit 5C, Maple Residences, Makati City" },
  { key: "memberSince", label: "Member since", value: "November 2022" },
  { key: "completedOrders", label: "Completed orders", value: "46" },
  { key: "preferredService", label: "Preferred service", value: "Regular Wash & Fold" },
  { key: "paymentPreference", label: "Payment preference", value: "G-Cash" },
];

export default function Profile() {
  const [details, setDetails] = useState(defaultProfileDetails);
  const [draftDetails, setDraftDetails] = useState(defaultProfileDetails);
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => {
    setDraftDetails(details.map((detail) => ({ ...detail })));
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setDraftDetails(details.map((detail) => ({ ...detail })));
    setIsEditing(false);
  };

  const saveChanges = () => {
    setDetails(draftDetails.map((detail) => ({ ...detail })));
    setIsEditing(false);
  };

  const handleInputChange = (key, value) => {
    setDraftDetails((prev) =>
      prev.map((detail) =>
        detail.key === key ? { ...detail, value } : detail
      )
    );
  };

  const visibleDetails = isEditing ? draftDetails : details;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <CustomerHeader />

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile information</h2>
                <p className="text-sm text-gray-500">Manage your personal details and delivery preferences.</p>
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
                <div key={detail.key} className="rounded-xl border border-slate-100 bg-white p-4 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-gray-400">{detail.label}</p>
                  {isEditing ? (
                    <Input
                      value={detail.value}
                      onChange={(event) => handleInputChange(detail.key, event.target.value)}
                      className="bg-slate-50"
                    />
                  ) : (
                    <p className="text-base font-medium text-gray-900">{detail.value}</p>
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
