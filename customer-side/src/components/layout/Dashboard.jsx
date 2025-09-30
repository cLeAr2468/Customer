import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, User, ShoppingBasket, CreditCard, FileCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function LaundryDashboard() {
  const [selectedStars, setSelectedStars] = useState(new Set());
  const [hoveredRating, setHoveredRating] = useState(0);

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

  // Calculate the current rating based on the number of selected stars
  const rating = selectedStars.size;

  return (
    <div className="min-h-screen bg-sky-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-sky-600 text-white p-4 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-sky-400 rounded-full flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-bold text-lg">GABIANA ANGIE</h2>
        </div>
        <Button variant="secondary" className="bg-transparent border border-white hover:bg-white hover:text-sky-600">
          LOGOUT
        </Button>
      </div>

      {/* Content */}
      <Card className="rounded-b-2xl shadow-lg">
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Laundry Status */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <ShoppingBasket className="w-5 h-5" /> LAUNDRY STATUS
            </h3>
            <p className="flex items-center gap-2 text-sm">
              <Checkbox checked /> Ready to pick up
            </p>

            <div className="mt-4 border rounded-md p-3 text-sm">
              <p><strong>LAUNDRY ID:</strong> 25-0001</p>
              <p><strong>BATCH:</strong> —</p>
              <p><strong>AMOUNT:</strong> —</p>
              <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700 w-full">RECEIVED</Button>
            </div>
          </div>

          {/* Payment Section */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <CreditCard className="w-5 h-5" /> PAYMENT STATUS
            </h3>
            <p className="text-green-700 font-semibold">PAID</p>

            <h4 className="mt-4 font-bold">PAYMENT OPTION</h4>
            <RadioGroup defaultValue="cash" className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="cash" id="cash" />
                <label htmlFor="cash">CASH ON PICK-UP</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="gcash" id="gcash" />
                <label htmlFor="gcash">G-CASH</label>
              </div>
            </RadioGroup>

            <div className="mt-4 border rounded-md p-3 text-center">
              <p className="text-sm mb-2 flex items-center gap-2 justify-center">
                <FileCheck className="w-4 h-4" /> Proof Uploaded
              </p>
              <Button variant="outline">UPLOAD</Button>
            </div>
          </div>

          {/* Rating Section */}
          <div>
            <h3 className="font-bold flex items-center gap-2 mb-2">
              <Star className="w-5 h-5" /> TO RATE
            </h3>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((starNumber) => (
                <button
                  key={starNumber}
                  onClick={() => handleStarClick(starNumber)}
                  onMouseEnter={() => handleStarHover(starNumber)}
                  onMouseLeave={() => handleStarHover(0)}
                  className="focus:outline-none"
                >
                  <Star 
                    className={`w-6 h-6 cursor-pointer transition-colors duration-200 ${
                      hoveredRating ? 
                        starNumber <= hoveredRating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                        : selectedStars.has(starNumber) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {rating ? `You rated ${rating} star${rating !== 1 ? 's' : ''}` : 'Click to rate'}
            </p>
            <Textarea placeholder="Write your comment here..." className="mb-3" />
            <Button 
              className="bg-sky-600 hover:bg-sky-700 w-full"
              disabled={!rating}
            >
              SUBMIT
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
