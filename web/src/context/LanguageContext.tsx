'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ScriptType } from '@/lib/transliteration';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'te' | 'kn' | 'bn' | 'ml' | 'gu';

export interface LanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  script: ScriptType;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English (Sanskrit)', nativeName: 'English', script: 'iast' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'devanagari' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'telugu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'kannada' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'bengali' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'malayalam' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'gujarati' },
];

export const UI_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  // Navigation Bar Primary Links
  nav_samhita: {
    en: 'Samhita',
    hi: 'संहिता',
    mr: 'संहिता',
    ta: 'சம்ஹிதை',
    te: 'సంహిత',
    kn: 'ಸಂಹಿತೆ',
    bn: 'সংহিতা',
    ml: 'സംഹിത',
    gu: 'સંહિતા',
  },
  nav_journey: {
    en: 'Rama Yatra',
    hi: 'राम यात्रा',
    mr: 'राम यात्रा',
    ta: 'ராம யாத்திரை',
    te: 'రామ యాత్ర',
    kn: 'ರಾಮ ಯಾತ್ರೆ',
    bn: 'রাম যাত্রা',
    ml: 'രാമ യാത്ര',
    gu: 'રામ યાત્રા',
  },
  nav_parikrama: {
    en: 'Parikrama',
    hi: 'परिक्रमा',
    mr: 'परिक्रमा',
    ta: 'பிரதக்ஷிணம்',
    te: 'ప్రదక్షిణ',
    kn: 'ಪರಿಕ್ರಮ',
    bn: 'পরিক্রমা',
    ml: 'പ്രദക്ഷിണം',
    gu: 'પરિક્રમા',
  },
  nav_characters: {
    en: 'Charitra',
    hi: 'चरित्र',
    mr: 'चरित्र',
    ta: 'பாத்திரங்கள்',
    te: 'పాత్రలు',
    kn: 'ಪಾತ್ರಗಳು',
    bn: 'চরিত্র',
    ml: 'കഥാപാത്രങ്ങൾ',
    gu: 'ચરિત્ર',
  },
  nav_relics: {
    en: 'Divyastra',
    hi: 'दिव्यास्त्र',
    mr: 'दिव्यास्त्र',
    ta: 'திவ்யாஸ்திரம்',
    te: 'దివ్యాస్త్రం',
    kn: 'ದಿವ್ಯಾಸ್ತ್ರ',
    bn: 'দিব্যাস্ত্র',
    ml: 'ദിവ്യാസ്ത്രം',
    gu: 'દિવ્યાસ્ત્ર',
  },
  nav_compass: {
    en: 'Dharma Niti',
    hi: 'धर्म नीति',
    mr: 'धर्म नीती',
    ta: 'தர்ம நீதி',
    te: 'ధర్మ నీతి',
    kn: 'ಧರ್ಮ ನೀತಿ',
    bn: 'ধর্ম নীতি',
    ml: 'ധർമ്മ നീതി',
    gu: 'ધર્મ નીતિ',
  },
  nav_parayana: {
    en: 'Parayana',
    hi: 'पारायण',
    mr: 'पारायण',
    ta: 'பாராயணம்',
    te: 'పారాయణం',
    kn: 'ಪಾರಾಯಣ',
    bn: 'পারায়ণ',
    ml: 'പാരായണം',
    gu: 'પારાયણ',
  },

  // Mobile Menu Subtitles
  sub_samhita: {
    en: 'Mula Samhita (7 Sacred Kandas)',
    hi: 'मूल संहिता (७ पवित्र काण्ड)',
    mr: 'मूळ संहिता (७ पवित्र कांडे)',
    ta: 'மூல சம்ஹிதை (7 புனித காண்டங்கள்)',
    te: 'మూల సంహిత (7 పవిత్ర కాండాలు)',
    kn: 'ಮೂಲ ಸಂಹಿತೆ (೭ ಪವಿತ್ರ ಕಾಂಡಗಳು)',
    bn: 'মূল সংহিতা (৭টি পবিত্র কাণ্ড)',
    ml: 'മൂല സംഹിത (7 പവിത്ര കാണ്ഡങ്ങൾ)',
    gu: 'મૂળ સંહિતા (૭ પવિત્ર કાંડ)',
  },
  sub_journey: {
    en: 'Rama Yatra (14-Year Journey Map)',
    hi: 'श्रीराम वनवास यात्रा (१४ वर्षीय मार्ग)',
    mr: 'श्रीराम वनवास यात्रा (१४ वर्षांचा मार्ग)',
    ta: 'ராம யாத்திரை (14 ஆண்டு பயண வரைபடம்)',
    te: 'శ్రీరామ వనవాస యాత్ర (14 ఏళ్ళ మార్గం)',
    kn: 'ಶ್ರೀರಾಮ ವನವಾಸ ಯಾತ್ರೆ (೧೪ ವರ್ಷಗಳ ಮಾರ್ಗ)',
    bn: 'শ্রীরাম বনবাস যাত্রা (১৪ বছরের পথ)',
    ml: 'ശ്രീരാമ വനവാസ യാത്ര (14 വർഷത്തെ മാർഗ്ഗം)',
    gu: 'શ્રીરામ વનવાસ યાત્રા (૧૪ વર્ષનો માર્ગ)',
  },
  sub_parikrama: {
    en: 'Mandir Parikrama (108 Sacred Names)',
    hi: 'मन्दिर परिक्रमा (१०८ दिव्य नामावली)',
    mr: 'मंदिर परिक्रमा (१०८ दिव्य नामावली)',
    ta: 'கோவில் பிரதக்ஷிணம் (108 நாமங்கள்)',
    te: 'మందిర ప్రదక్షిణ (108 దివ్య నామాలు)',
    kn: 'ಮಂದಿರ ಪರಿಕ್ರಮ (೧೦೮ ದಿವ್ಯ ನಾಮಗಳು)',
    bn: 'মন্দির পরিক্রমা (১০৮ দিব্য নামাবলী)',
    ml: 'ക്ഷേത്ര പ്രദക്ഷിണം (108 നാമങ്ങൾ)',
    gu: 'મંદિર પરિક્રમા (૧૦૮ દિવ્ય નામાવલી)',
  },
  sub_characters: {
    en: 'Charitra Sangha (Lineages & Figures)',
    hi: 'चरित्र संघ (१९४ रामायण पात्र व वंश)',
    mr: 'चरित्र संघ (१९४ रामायण पात्रे व वंश)',
    ta: 'பாத்திரங்கள் (வம்சாவளிகள் & கதாபாத்திரங்கள்)',
    te: 'పాత్ర సంగ్రహం (వంశాలు & ప్రముఖులు)',
    kn: 'ಪಾತ್ರ ಸಂಘ (ವಂಶಾವಳಿಗಳು & ಪಾತ್ರಗಳು)',
    bn: 'চরিত্র সংঘ (১৯৪টি চরিত্র ও বংশাবলী)',
    ml: 'കഥാപാത്രങ്ങൾ (വംശാവലിയും കഥാപാത്രങ്ങളും)',
    gu: 'ચરિત્ર સંઘ (૧૯૪ રામાયણ પાત્રો અને વંશ)',
  },
  sub_relics: {
    en: 'Divyastra Kosha (Sacred Relics)',
    hi: 'दिव्यास्त्र कोष (दिव्य आयुध व अवशेष)',
    mr: 'दिव्यास्त्र कोष (दिव्य अस्त्रे व अवशेष)',
    ta: 'திவ்யாஸ்திர கருவூலம் (புனித ஆயுதங்கள்)',
    te: 'దివ్యాస్త్ర కోశం (దివ్య ఆయుధాలు & అవశేషాలు)',
    kn: 'ದಿವ್ಯಾಸ್ತ್ರ ಕೋಶ (ಪವಿತ್ರ ಆಯುಧಗಳು)',
    bn: 'দিব্যাস্ত্র কোষ (দিব্য অস্ত্র ও নিদর্শন)',
    ml: 'ദിവ്യാസ്ത്ര കോശം (വിശുദ്ധ ആയുധങ്ങൾ)',
    gu: 'દિવ્યાસ્ત્ર કોષ (દિવ્ય અસ્ત્રો અને અવશેષો)',
  },
  sub_compass: {
    en: 'Dharma Niti (Values & Moral Dilemmas)',
    hi: 'धर्म नीति (जीवन मूल्य व धर्म संकट)',
    mr: 'धर्म नीती (जीवन मूल्ये व धर्म संकट)',
    ta: 'தர்ம நீதி (மதிப்பீடுகள் & தர்ம சங்கடம்)',
    te: 'ధర్మ నీతి (నైతిక విలువలు & పరీక్ష)',
    kn: 'ಧರ್ಮ ನೀತಿ (ಮೌಲ್ಯಗಳು & ಧರ್ಮ ಸಂಕಟ)',
    bn: 'ধর্ম নীতি (নৈতিক মূল্যবোধ ও দ্বন্দ্ব)',
    ml: 'ധർമ്മ നീതി (ജീവിത മൂല്യങ്ങൾ)',
    gu: 'ધર્મ નીતિ (જીવન મૂલ્યો અને ધર્મ સંકટ)',
  },
  sub_parayana: {
    en: 'Nitya Parayana (7-Day Recital Regimen)',
    hi: 'नित्य पारायण (सप्तदिवसीय पाठ अनुष्ठान)',
    mr: 'नित्य पारायण (सात दिवसांचे पाठ अनुष्ठान)',
    ta: 'நித்ய பாராயணம் (7 நாள் பாராயண முறை)',
    te: 'నిత్య పారాయణం (7 రోజుల పారాయణ క్రమం)',
    kn: 'ನಿತ್ಯ ಪಾರಾಯಣ (೭ ದಿನಗಳ ಪಾರಾಯಣ ವಿಧಾನ)',
    bn: 'নিত্য পারায়ণ (সপ্তদিবসীয় পাঠ বিধি)',
    ml: 'നിത്യ പാരായണം (7 ദിവസത്തെ പാരായണ രീതി)',
    gu: 'નિત્ય પારાયણ (સાત દિવસીય પાઠ અનુષ્ઠાન)',
  },

  // Actions & Utilities
  action_prologue: {
    en: 'Prologue',
    hi: 'प्रस्तावना',
    mr: 'प्रस्तावना',
    ta: 'முகப்புரை',
    te: 'పీఠిక',
    kn: 'ಮುನ್ನುಡಿ',
    bn: 'প্রস্তাবনা',
    ml: 'ആമുഖം',
    gu: 'પ્રસ્તાવના',
  },
  action_search: {
    en: 'Search',
    hi: 'खोजें',
    mr: 'शोधा',
    ta: 'தேடு',
    te: 'వెతకండి',
    kn: 'ಹುಡುಕಿ',
    bn: 'অনুসন্ধান',
    ml: 'തിരയുക',
    gu: 'શોધો',
  },
  action_language: {
    en: 'Language',
    hi: 'भाषा',
    mr: 'भाषा',
    ta: 'மொழி',
    te: 'భాష',
    kn: 'ಭಾಷೆ',
    bn: 'ভাষা',
    ml: 'ഭാഷ',
    gu: 'ભાષા',
  },
  book_mode: {
    en: 'Book Mode',
    hi: 'ग्रंथ स्वरूप',
    mr: 'ग्रंथ स्वरूप',
    ta: 'புத்தக முறை',
    te: 'గ్రంథ రూపం',
    kn: 'ಗ್ರಂಥ ರೂಪ',
    bn: 'গ্রন্থ রূপ',
    ml: 'ഗ്രന്ഥ രൂപം',
    gu: 'ગ્રંથ સ્વરૂપ',
  },
  read_as_book: {
    en: 'Read as Book (Book UI)',
    hi: 'ग्रंथ रूप में पढ़ें (Book UI)',
    mr: 'ग्रंथ स्वरूपात वाचा (Book UI)',
    ta: 'புத்தகமாகப் படிக்க (Book UI)',
    te: 'గ్రంథ రూపంలో చదవండి (Book UI)',
    kn: 'ಗ್ರಂಥ ರೂಪದಲ್ಲಿ ಓದಿ (Book UI)',
    bn: 'গ্রন্থ রূপে পড়ুন (Book UI)',
    ml: 'ഗ്രന്ഥ രൂപത്തിൽ വായിക്കുക (Book UI)',
    gu: 'ગ્રંથ સ્વરૂપે વાંચો (Book UI)',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currentLanguageInfo: LanguageInfo;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ramayana_language') as LanguageCode;
      if (saved && LANGUAGES.some(l => l.code === saved)) {
        setLanguageState(saved);
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ramayana_language', lang);
    }
  };

  const currentLanguageInfo = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const t = (key: string): string => {
    if (UI_TRANSLATIONS[key] && UI_TRANSLATIONS[key][language]) {
      return UI_TRANSLATIONS[key][language];
    }
    // Fallback to English, then to key
    return UI_TRANSLATIONS[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currentLanguageInfo, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
