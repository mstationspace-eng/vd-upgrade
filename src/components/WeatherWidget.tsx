import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

interface WeatherData {
  location: string;
  temperature: string;
  condition: {
    en: string;
    ar: string;
  };
  time: string;
  date: string;
}

export const WeatherWidget = () => {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData>({
    location: "Saudi Arabia",
    temperature: "32°C",
    condition: {
      en: "Clear Sky",
      ar: "سماء صافية"
    },
    time: "04:18 PM",
    date: "Monday, 18 August"
  });

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date();
      
      // Format time and date based on language
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      };
      
      const dateOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        day: 'numeric',
        month: 'long'
      };
      
      const locale = language === 'ar' ? 'ar-SA' : 'en-US';
      
      const time = now.toLocaleTimeString(locale, timeOptions);
      const date = now.toLocaleDateString(locale, dateOptions);
      
      setWeather(prev => ({ ...prev, time, date }));
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);

    return () => clearInterval(interval);
  }, [language]);

  return (
    <Card className="p-4 bg-card/80 backdrop-blur-md border-border/50 shadow-lg min-w-[200px]">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            {weather.temperature}
          </span>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {weather.condition[language]}
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{weather.time}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {weather.date}
          </div>
        </div>
      </div>
    </Card>
  );
};