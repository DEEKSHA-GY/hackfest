'use client';

import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    title: "Karnataka Citizen Dashboard",
    liveMap: "City Live Map",
    civicForms: "Civic Forms & Permits",
    assistant: "AI Assistant",
    support: "Support & Complaints",
    searchPlaceholder: "Search districts or locations...",
    population: "Population",
    literacy: "Literacy Rate",
    density: "Population Density",
    fileComplaint: "File New Complaint",
    activeTickets: "Active Tickets",
    resolvedHistory: "Resolved History",
    quickActions: "Quick Actions",
    emergencyContact: "Emergency Contact",
    callAmbulance: "Call Ambulance (108)",
    applyNow: "Apply Now",
    applyForPermits: "Apply for Permits",
    viewDetails: "View Details",
    emergency: "Emergency",
    howCanIHelp: "How can I help you today?",
    askAnything: "Ask about civic rules, budgets, or permits...",
    suggestedTopics: "Suggested Topics",
    permitStatus: "Permit Status",
    garbageIssue: "Garbage Report",
    safetyRules: "Safety Rules",
    roadClosurePermission: "Road Closure Permission",
    processionPermission: "Procession Permission",
    receipt: "Receipt",
    submitted: "Submitted",
    signIn: "Sign In",
    signOut: "Sign Out",
    simulations: "Live Simulations",
    ambulanceRoutes: "Hospital Corridors",
    busRoutes: "Transit Routes",
    roadClosures: "Road Closures",
    basicDetails: "Basic Details",
    fullAddress: "Full Address",
    purposeOfRequest: "Purpose of Request",
    generateDraft: "Generate Draft Letter",
    previewLetter: "Preview Application",
  },
  kn: {
    title: "ಕರ್ನಾಟಕ ನಾಗರಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    liveMap: "ನಗರ ಲೈವ್ ಮ್ಯಾಪ್",
    civicForms: "ನಾಗರಿಕ ಫಾರ್ಮ್‌ಗಳು ಮತ್ತು ಪರ್ಮಿಟ್‌ಗಳು",
    assistant: "AI ಸಹಾಯಕ",
    support: "ಬೆಂಬಲ ಮತ್ತು ದೂರುಗಳು",
    searchPlaceholder: "ಜಿಲ್ಲೆಗಳು ಅಥವಾ ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಿ...",
    population: "ಜನಸಂಖ್ಯೆ",
    literacy: "ಸಾಕ್ಷರತೆ ಪ್ರಮಾಣ",
    density: "ಜನಸಂಖ್ಯಾ ಸಾಂದ್ರತೆ",
    fileComplaint: "ಹೊಸ ದೂರು ದಾಖಲಿಸಿ",
    activeTickets: "ಸಕ್ರಿಯ ಟಿಕೆಟ್‌ಗಳು",
    resolvedHistory: "ಪರಿಹರಿಸಿದ ಇತಿಹಾಸ",
    quickActions: "ತ್ವರಿತ ಕ್ರಮಗಳು",
    emergencyContact: "ತುರ್ತು ಸಂಪರ್ಕ",
    callAmbulance: "ಅಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ (108)",
    applyNow: "ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    applyForPermits: "ಪರ್ಮಿಟ್‌ಗಳಿಗಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    viewDetails: "ವಿವರಗಳನ್ನು ನೋಡಿ",
    emergency: "ತುರ್ತು",
    howCanIHelp: "ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
    askAnything: "ನಾಗರಿಕ ನಿಯಮಗಳು, ಬಜೆಟ್ ಅಥವಾ ಪರ್ಮಿಟ್‌ಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    suggestedTopics: "ಸೂಚಿಸಿದ ವಿಷಯಗಳು",
    permitStatus: "ಪರ್ಮಿಟ್ ಸ್ಥಿತಿ",
    garbageIssue: "ಕಸದ ವರದಿ",
    safetyRules: "ಸುರಕ್ಷತಾ ನಿಯಮಗಳು",
    roadClosurePermission: "ರಸ್ತೆ ಮುಚ್ಚುವ ಅನುಮತಿ",
    processionPermission: "ಮೆರವಣಿಗೆ ಅನುಮತಿ",
    receipt: "ರಶೀದಿ",
    submitted: "ಸಲ್ಲಿಸಲಾಗಿದೆ",
    signIn: "ಸೈನ್ ಇನ್",
    signOut: "ಸೈನ್ ಔಟ್",
    simulations: "ಲೈವ್ ಸಿಮ್ಯುಲೇಶನ್ಸ್",
    ambulanceRoutes: "ಆಸ್ಪತ್ರೆ ಮಾರ್ಗಗಳು",
    busRoutes: "ಬಸ್ ಮಾರ್ಗಗಳು",
    roadClosures: "ರಸ್ತೆ ಮುಚ್ಚುವಿಕೆ",
    basicDetails: "ಮೂಲ ವಿವರಗಳು",
    fullAddress: "ಪೂರ್ಣ ವಿಳಾಸ",
    purposeOfRequest: "ಮನವಿಯ ಉದ್ದೇಶ",
    generateDraft: "ಕರಡು ಪತ್ರ ಸಿದ್ಧಪಡಿಸಿ",
    previewLetter: "ಅರ್ಜಿಯ ಅವಲೋಕನ",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
