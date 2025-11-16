import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation & General
    contactUs: 'Contact Us',
    submit: 'Submit',
    close: 'Close',
    language: 'العربية',
    
    // Form Fields
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone Number',
    subject: 'Subject',
    message: 'Message',
    company: 'Company (Optional)',
    
    // Placeholders
    firstNamePlaceholder: 'Enter your first name',
    lastNamePlaceholder: 'Enter your last name',
    emailPlaceholder: 'Enter your email address',
    phonePlaceholder: 'Enter your phone number',
    subjectPlaceholder: 'What is this regarding?',
    messagePlaceholder: 'Tell us how we can help you...',
    companyPlaceholder: 'Your company name',
    
    // Form validation
    required: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidPhone: 'Please enter a valid phone number',
    
    // Success message
    formSubmitted: 'Thank you! Your message has been sent successfully.',
    
    // Map info
    mapInfo: 'Click on landmarks to view details • Scroll to zoom • Drag to pan',
  },
  ar: {
    // Navigation & General
    contactUs: 'اتصل بنا',
    submit: 'إرسال',
    close: 'إغلاق',
    language: 'English',
    
    // Form Fields
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    subject: 'الموضوع',
    message: 'الرسالة',
    company: 'الشركة (اختياري)',
    
    // Placeholders
    firstNamePlaceholder: 'أدخل اسمك الأول',
    lastNamePlaceholder: 'أدخل اسم العائلة',
    emailPlaceholder: 'أدخل عنوان بريدك الإلكتروني',
    phonePlaceholder: 'أدخل رقم هاتفك',
    subjectPlaceholder: 'ما هو موضوع استفسارك؟',
    messagePlaceholder: 'أخبرنا كيف يمكننا مساعدتك...',
    companyPlaceholder: 'اسم شركتك',
    
    // Form validation
    required: 'هذا الحقل مطلوب',
    invalidEmail: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
    
    // Success message
    formSubmitted: 'شكراً لك! تم إرسال رسالتك بنجاح.',
    
    // Map info
    mapInfo: 'انقر على المعالم لعرض التفاصيل • مرر للتكبير • اسحب للتحرك',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Set document direction based on language
  React.useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};