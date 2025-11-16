import { useEffect, useRef, useState } from "react";
import { MapViewer } from "@/components/MapViewer";
import { WeatherWidget } from "@/components/WeatherWidget";
import { LocationSelector } from "@/components/LocationSelector";
import { ContactForm } from "@/components/ContactForm";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/contexts/LanguageContext";
import Toolbar from "@/components/Toolbar";
import Locations from "@/components/Locations";
import "../Style.css";
import { TranslateProvider, useTranslate } from "@/contexts/TranslateContext";
import { CloudsProvider } from "@/contexts/CloudsContext";
import ChatWidget from "@/components/ChatWidget";

const Index = () => {
  const mapViewerRef = useRef(null);

  const [showBorder, setShowBorder] = useState(true);

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  const handleLocationSelect = (id: string) => {
    setSelectedLocationId(id);
  };

  useEffect(() => {
    if (selectedLocationId && mapViewerRef.current) {
      (mapViewerRef.current as any).zoomToLocation(selectedLocationId);
    }
  }, [selectedLocationId]);

  // const toggleBorders = () => {
  //   // alert(2);
  //   setShowBorder(prev => !prev);
  // };

  const [currentLocation, setCurrentLocation] = useState("Saudi Arabia");
  const { t } = useLanguage();
  const { language } = useTranslate();

  const handleToggleBorders = () => {
    if (mapViewerRef.current) {
      (mapViewerRef.current as any).toggleBorders();
    }
  };

  const handleZoomIn = () => {
    if (mapViewerRef.current) {
      (mapViewerRef.current as any).zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapViewerRef.current) {
      (mapViewerRef.current as any).zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapViewerRef.current) {
      (mapViewerRef.current as any).resetView();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* Map Container */}
      <MapViewer ref={mapViewerRef} />

      {/* Top Left Controls */}
      <div className="absolute top-10 left-10 z-10 flex flex-col gap-3">
        {/* <LocationSelector 
          currentLocation={currentLocation}
          onLocationChange={setCurrentLocation}
        /> */}
        <Locations onSelectLocation={handleLocationSelect} />
        {/* <LanguageToggle /> */}
      </div>

      {/* Top Right Controls */}
      <div className="absolute top-10 right-10 z-20 flex flex-col gap-3">
        {/* <WeatherWidget /> */}
        <Toolbar
          toggleBorders={handleToggleBorders}
          zoomIn={handleZoomIn}
          zoomOut={handleZoomOut}
          resetView={handleResetView}
        />
        {/* <ContactForm /> */}
      </div>

      {/* Map Controls Info */}
      <div className="absolute bottom-6 left-0 z-10 w-full flex justify-between gap-2 items-center">
        <div className="border backdrop-blur-20 cursor-pointer text-black border-border/50 rounded-lg p-3 text-xs ml-6 ">
          {language === "en"
            ? "Click on landmarks to view details • Scroll to zoom • Drag to pan"
            : "انقر على المعالم لعرض التفاصيل • مرر للتكبير • اسحب للتحرك"}
        </div>
        {/* chatbot container */}
        {/* <ChatWidget /> */}
      </div>
    </div>
  );
};

const AppWrapper = () => (
  <TranslateProvider>
    <CloudsProvider>
      <Index />
    </CloudsProvider>
  </TranslateProvider>
);

export default AppWrapper;
