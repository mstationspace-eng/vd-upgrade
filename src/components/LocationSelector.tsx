import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, MapPin } from "lucide-react";

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange?: (location: string) => void;
}

const locations = [
  "Saudi Arabia",
  "Riyadh",
  "Makkah",
  "Medina",
  "Jeddah",
  "Eastern Province",
];

export const LocationSelector = ({
  currentLocation,
  onLocationChange,
}: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLocationSelect = (location: string) => {
    onLocationChange?.(location);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Card className="bg-card/80 backdrop-blur-md bg-red-400 border-border/50 shadow-lg">
        <Button
          variant="ghost"
          className="flex items-center gap-2 p-4 text-foreground hover:bg-accent/50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MapPin className="w-4 h-4" />
          <span className="font-medium">{currentLocation}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden">
            {locations.map((location) => (
              <button
                key={location}
                className="w-full px-4 py-3 text-left text-sm hover:bg-accent/50 transition-colors text-foreground"
                onClick={() => handleLocationSelect(location)}
              >
                {location}
              </button>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
