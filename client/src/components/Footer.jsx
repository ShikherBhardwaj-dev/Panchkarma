import React from "react";
import { Leaf, Heart } from "lucide-react";

// Import background patterns
const lotusPattern = "/patterns/lotus-bg.svg";
const mandalaPattern = "/patterns/mandala-bg.svg";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-orange-50 border-t border-amber-100 mt-12">
      {/* Background Patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-8 bottom-0 w-32 h-32 opacity-5">
          <img src={lotusPattern} alt="" className="w-full h-full" />
        </div>
        <div className="absolute right-0 top-0 w-24 h-24 opacity-5">
          <img src={mandalaPattern} alt="" className="w-full h-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Leaf className="h-6 w-6 text-primary-600" />
              <div className="absolute -top-1 -right-1 text-amber-200 animate-pulse">
                <Heart className="h-3 w-3 fill-current" />
              </div>
            </div>
            <span className="text-sm font-medium text-amber-800">
              AyurSutra - Authentic Panchakarma Management
            </span>
          </div>
          <div className="text-sm text-amber-700 text-center md:text-right">
            <p className="font-medium">© 2025 AyurSutra</p>
            <p className="mt-1 text-amber-600 text-xs">
              Integrating traditional wisdom with modern technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
