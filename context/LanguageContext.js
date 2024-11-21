import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageContext = createContext();

// LanguageProvider component to manage language state and storage
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const loadPreferredLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem("preferredLanguage");
        if (storedLanguage) {
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error("Failed to load preferred language:", error);
      }
    };
    loadPreferredLanguage();
  }, []);

  const updateLanguage = async (newLanguage) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem("preferredLanguage", newLanguage);
    } catch (error) {
      console.error("Failed to save preferred language:", error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, updateLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the LanguageContext
export const useLanguage = () => useContext(LanguageContext);
