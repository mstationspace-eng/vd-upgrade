import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={toggleLanguage}
      className="bg-card/80 backdrop-blur-md border-border/50 hover:bg-card/90 gap-2"
    >
      <Languages className="w-4 h-4" />
      {t('language')}
    </Button>
  );
};