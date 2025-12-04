import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, ShoppingBasket, CreditCard, FileCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRef, useState } from "react"
import CustomerHeader from "./CustomerHeader"
import { useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api";


export default function Payment() {
  const [selectedStars, setSelectedStars] = useState(new Set());
  const [hoveredRating, setHoveredRating] = useState(0);
  const [proofFile, setProofFile] = useState(null);
  const [paymentOption, setPaymentOption] = useState("cash");
  const fileInputRef = useRef(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const { customerData } = useContext(AuthContext);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      if (!customerData) return;

      try {
        const res = await fetchApi(
          `/api/auth/displayed-payment-method/${customerData.shop_id}`
        );

        setPaymentMethods(res.data || []);
      } catch (error) {
        console.error("Error loading payment methods:", error);
      }
    };

    loadPaymentMethods();
  }, [customerData]);


  const handleStarClick = (starNumber) => {
    setSelectedStars(prev => {
      const newSelection = new Set();

      // If clicking on currently selected highest star, unselect all
      if (prev.size > 0 && Math.max(...prev) === starNumber) {
        return newSelection; // Return empty set to unselect all
      }

      // Otherwise, select all stars up to the clicked one
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

  const handleUploadClick = () => {
    if (paymentOption !== "gcash") return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProofFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <CustomerHeader />

        <Card className="shadow-lg">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 p-3 sm:p-6">
            {/* Laundry Status */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <ShoppingBasket className="w-5 h-5" /> LAUNDRY STATUS
              </h3>
              <p className="flex items-center gap-2 text-sm">
                <Checkbox checked /> Ready to pick up
              </p>

              <div className="mt-3 sm:mt-4 border rounded-md p-2 sm:p-3 text-xs sm:text-sm">
                <p className="mb-1"><strong>LAUNDRY ID:</strong> 25-0001</p>
                <p className="mb-1"><strong>BATCH:</strong> —</p>
                <p className="mb-1"><strong>AMOUNT:</strong> —</p>
                <Button className="mt-2 sm:mt-3 bg-emerald-600 hover:bg-emerald-700 w-full text-xs sm:text-sm h-8 sm:h-10">
                  RECEIVED
                </Button>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <CreditCard className="w-5 h-5" /> PAYMENT STATUS
              </h3>
              <p className="text-green-700 font-semibold">PAID</p>

              {/* PAYMENT OPTION */}
              <h4 className="mt-4 font-bold">PAYMENT OPTION</h4>

              <RadioGroup
                value={paymentOption}
                onValueChange={setPaymentOption}
                className="space-y-2 mt-2"
              >
                {/* STATIC OPTION */}
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <label htmlFor="cash">CASH ON PICK-UP</label>
                </div>

                {paymentMethods.map((pm, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <RadioGroupItem value={pm.pm_name.toLowerCase()} id={pm.pm_name} />
                    <label htmlFor={pm.pm_name}>{pm.pm_name.toUpperCase()}</label>
                  </div>
                ))}
              </RadioGroup>

              {paymentMethods
                .filter(pm => pm.pm_name.toLowerCase() === paymentOption)
                .map(pm => (
                  <div
                    key={pm.pm_name}
                    className="mt-3 border rounded-md p-3 text-center space-y-3"
                  >
                    <p className="font-bold">{pm.pm_name} Payment Details</p>

                    {pm.qrCode_image_url && (
                      <img
                        src={pm.qrCode_image_url}
                        alt={`${pm.pm_name} QR Code`}
                        className="mx-auto w-40 h-40 object-cover rounded-md shadow"
                      />
                    )}

                    {/* ACCOUNT DETAILS */}
                    <div className="text-sm space-y-1">
                      <p><strong>Account Name:</strong> {pm.account_name}</p>
                      <p><strong>Account Number:</strong> {pm.account_number}</p>
                      <p className="text-gray-600">{pm.description}</p>
                    </div>
                  </div>
                ))}

              {/* PROOF UPLOAD (ENABLED ONLY FOR GCASH / PAYMAYA) */}
              <div className="mt-4 border rounded-md p-3 text-center space-y-2">
                <p className="text-xs flex items-center justify-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  {proofFile ? "File selected" : "Proof Uploaded"}
                </p>

                {/* FILE NAME */}
                {proofFile && (
                  <p className="text-xs text-gray-500 truncate">{proofFile.name}</p>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  type="button"
                  variant="outline"
                  disabled={paymentOption === "cash"}
                  onClick={handleUploadClick}
                  className="text-sm w-full"
                >
                  {paymentOption === "cash"
                    ? "Select GCash/PayMaya to upload"
                    : proofFile
                      ? "Change Image"
                      : "Upload Image"}
                </Button>

                <Button
                  type="button"
                  className="bg-sky-600 hover:bg-sky-700 text-white w-full"
                  disabled={paymentOption === "cash" || !proofFile}
                >
                  Submit Proof
                </Button>
              </div>
            </div>

            {/* Rating Section */}
            <div>
              <h3 className="font-bold flex items-center gap-2 mb-2">
                <Star className="w-5 h-5" /> TO RATE
              </h3>
              <div className="flex justify-center sm:justify-start gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((starNumber) => (
                  <button
                    key={starNumber}
                    onClick={() => handleStarClick(starNumber)}
                    onMouseEnter={() => handleStarHover(starNumber)}
                    onMouseLeave={() => handleStarHover(0)}
                    className="focus:outline-none p-1 sm:p-0"
                  >
                    <Star
                      className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-colors duration-200 ${hoveredRating ?
                        starNumber <= hoveredRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        : selectedStars.has(starNumber) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 text-center sm:text-left">
                {rating ? `You rated ${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
              </p>
              <Textarea
                placeholder="Write your comment here..."
                className="mb-3 text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]"
              />
              <Button
                className="bg-sky-600 hover:bg-sky-700 w-full h-9 sm:h-10 text-xs sm:text-sm"
                disabled={!rating}
              >
                SUBMIT
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
