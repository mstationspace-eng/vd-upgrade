import React, { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import arrowImg from "../assets/images/elements.svg";
import logoImg from "../assets/images/logo.png";
import { useTranslate } from "@/contexts/TranslateContext";
import "../Style.css";
import frameImg from "../assets/images/Frame.png";
import hoverFrameImg from "../assets/images/Frame-02.png";

interface LocationsProps {
  onSelectLocation: (locationId: string) => void;
}

export default function Locations({ onSelectLocation }: LocationsProps) {
  const { language } = useTranslate();

  const locations = [
    {
      id: "saudi_arabia",
      name: { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
    },
    // {
    //   id: "riyadh",
    //   name: { en: "Riyadh", ar: "الرياض" },
    // },
    {
      id: "makkah",
      name: { en: "Makkah", ar: "مكة المكرمة" },
    },
    // {
    //   id: "dammam",
    //   name: { en: "Dammam", ar: "الدمام" },
    // },
    // {
    //   id: "medina",
    //   name: { en: "Medina", ar: "المدينة المنورة" },
    // },
    {
      id: "jeddah",
      name: { en: "Jeddah", ar: "جدة" },
    },
    {
      id: "taif",
      name: { en: "Taif", ar: "الطائف" },
    },
    // {
    //   id: "abha",
    //   name: { en: "Abha", ar: "أبها" },
    // },
    // {
    //   id: "tabuk",
    //   name: { en: "Tabuk", ar: "تبوك" },
    // },
  ];

  const [selectedLocation, setSelectedLocation] = useState(locations[0]);

  return (
    <div dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center w-[296px] gap-2 backdrop-blur-20 p-2 rounded-[12px] border-t border-t-white/10">
        <div className="w-[26px] h-6">
          <img src={logoImg} alt="logo" />
        </div>

        <div className="flex-1">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex justify-between items-center w-full outline-none">
                <span className="font-semibold">
                  {selectedLocation.name[language]}
                </span>
                <div className="w-10 cursor-pointer h-10 complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center">
                  <img src={arrowImg} alt="arrow icon" />
                </div>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              className="min-w-[250px] complex-shadows opacity-100 rounded-md shadow-lg p-2"
              sideOffset={8}
              style={{
                backgroundImage: `url(${frameImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              align="start"
            >
              {locations.map((location) => (
                <DropdownMenu.Item
                  key={location.id}
                  className={`px-2 py-1 rounded hover:bg-gray-300/60 cursor-pointer outline-none ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                  onSelect={() => {
                    setSelectedLocation(location);
                    onSelectLocation(location.id);
                  }}
                >
                  {location.name[language]}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </div>
  );
}
