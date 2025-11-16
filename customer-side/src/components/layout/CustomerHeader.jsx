import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Settings, ChevronDown } from "lucide-react";

export default function CustomerHeader({
  name = "Gabiana Angie",
  welcomeText = "Welcome back",
  subtitle,
  details = [],
  menuItems = ["View profile", "Logout"],
  className = ""
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuActionByLabel = {
    "view profile": () => navigate("/dashboard/profile"),
    "logout": () => navigate("/login"),
  };

  return (
    <Card className={`bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 text-white shadow-xl ${className}`}>
      <CardContent className="p-6 space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between lg:items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/80">{welcomeText}</p>
              <h1 className="text-2xl font-semibold">{name}</h1>
              {subtitle && <p className="text-sm text-white/90">{subtitle}</p>}
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            {details.length > 0 && (
              <div className="text-sm text-white/90 space-y-1 text-left lg:text-right">
                {details.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            )}
            <div className="relative w-full self-stretch sm:w-auto md:self-auto" ref={dropdownRef}>
              <Button
                type="button"
                variant="secondary"
                className="bg-white text-sky-600 hover:bg-white/90 border-none w-full justify-between sm:w-auto sm:justify-center"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <Settings className="h-4 w-4" />
                Settings
                <ChevronDown className="h-4 w-4" />
              </Button>
              {menuOpen && (
                <div className="absolute left-0 top-full z-10 mt-2 w-full rounded-xl bg-white text-slate-700 shadow-lg ring-1 ring-black/5 sm:left-auto sm:right-0 sm:w-44">
                  {menuItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                      onClick={() => {
                        setMenuOpen(false);
                        const action = menuActionByLabel[item.toLowerCase()];
                        if (action) {
                          action();
                        }
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
