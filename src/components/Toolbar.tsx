import React, { useEffect, useState } from "react";
import compassImg from "../assets/images/compass.svg";
import filterImg from "../assets/images/filter.svg";
import menuImg from "../assets/images/menu-01.svg";
import arrowImg from "../assets/images/elements.svg";
import viewImg from "../assets/images/view.svg";
import arrowExpandImg from "../assets/images/arrow-expand.svg";
import cloudImg from "../assets/images/cloud.svg";
import customerImg from "../assets/images/customer-service-01.svg";
import langImg from "../assets/images/language-circle.svg";
import searchImg from "../assets/images/search-visual.svg";
import zoomOutImg from "../assets/images/zoom-out-area.svg";
import zoomInImg from "../assets/images/zoom-in-area.svg";
import { Button } from "react-day-picker";
import "../Style.css";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useTranslate } from "@/contexts/TranslateContext";
import { useClouds } from "@/contexts/CloudsContext";
import ContactUs from "./ContactUs";

export default function Toolbar({ toggleBorders, zoomIn, zoomOut, resetView }) {
  const { language, setLanguage } = useTranslate();
  const { toggleClouds } = useClouds();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isContactUsOpen, setIsContactUsOpen] = useState(false);

  // New state to manage the active status of each button
  const [activeStates, setActiveStates] = useState({
    viewActive: false,
    customerActive: false,
    cloudActive: false,
    langActive: false,
    fullScreenActive: false,
  });

  const handleToggle = (buttonName) => {
    setActiveStates((prevStates) => ({
      ...prevStates,
      [buttonName]: !prevStates[buttonName],
    }));
  };

  const handleContactUsToggle = () => {
    setIsContactUsOpen(!isContactUsOpen);
    handleToggle('customerActive');
  };

  const handleTranslate = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div>
      <ContactUs 
        isOpen={isContactUsOpen} 
        onClose={() => {
          setIsContactUsOpen(false);
          setActiveStates(prev => ({ ...prev, customerActive: false }));
        }} 
      />
      {/* <div className="p-2 mb-2 backdrop-blur-20 border border-white/15 rounded-[12px] flex gap-2"> */}
        {/* compass icon */}
        {/* <div className="w-10 h-10 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center">
          <img src={compassImg} />
        </div> */}
        {/* menu list */}
        {/* <div className="flex items-center gap-2 h-10 complex-shadows p-2 rounded-[4px] border border-white/10 ">
          <div className="w-6 h-6">
            <img src={menuImg} alt="burger icon for menu" />
          </div>

          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex justify-between items-center w-[136px] outline-none">
                  <span>Menu</span>
                  <div className="w-6 h-6 flex items-center justify-center">
                    <img src={arrowImg} alt="menu" />
                  </div>
                </button>
              </DropdownMenu.Trigger>
            </DropdownMenu.Root>
          </div>
        </div> */}
        {/* filter icon */}
        {/* <div className="w-10 h-10 cursor-pointer rounded-[4px] border border-white/10  flex items-center justify-center complex-shadows">
          <img src={filterImg} />
        </div> */}
      {/* </div> */}

      {/* option icons */}
      <div className="w-full flex justify-end">
        <div className="p-2 w-fit mr-2 backdrop-blur-20 border border-white/15 rounded-[4px] grid grid-cols-4 gap-2">
          <div
            className={`w-12 cursor-pointer h-12 complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition ${activeStates.viewActive ? 'bg-gray-200' : ''}`}
            onClick={() => {
              toggleBorders();
              handleToggle('viewActive');
            }}
          >
            <img src={viewImg} />
          </div>
          <div
            className={`w-12 h-12 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition ${activeStates.customerActive ? 'bg-gray-200' : ''}`}
            onClick={handleContactUsToggle}
          >
            <img src={customerImg} />
          </div>
          <div
            className={`w-12 h-12 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition ${activeStates.cloudActive ? 'bg-gray-200' : ''}`}
            onClick={() => {
              toggleClouds();
              handleToggle('cloudActive');
            }}
          >
            <img src={cloudImg} />
          </div>
          <div
            className={`w-12 h-12 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition ${activeStates.langActive ? 'bg-gray-200' : ''}`}
            onClick={() => {
              handleTranslate();
              handleToggle('langActive');
            }}
          >
            <img src={langImg} />
          </div>
          <div
            className={`w-12 h-12 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition ${activeStates.fullScreenActive ? 'bg-gray-200' : ''}`}
            onClick={() => {
              toggleFullscreen();
              handleToggle('fullScreenActive');
            }}
          >
            <img src={arrowExpandImg} />
          </div>
          <div
            className={`w-12 h-12 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition`}
            onClick={() => {
              resetView();
            }}
          >
            <img src={searchImg} />
          </div>
          <div
            className={`w-12 h-12 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition`}
            onClick={() => {
              zoomIn();
            }}
          >
            <img src={zoomInImg} />
          </div>
          <div
            className={`w-12 h-12 cursor-pointer complex-shadows rounded-[4px] border border-white/10 flex items-center justify-center hover:bg-gray-200 transition `}
            onClick={() => {
              zoomOut();
            }}
          >
            <img src={zoomOutImg} />
          </div>
        </div>
      </div>
    </div>
  );
}