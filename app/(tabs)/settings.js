import tw from "twrnc";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { View, Text, Switch, TouchableOpacity } from "react-native";

// Define constants outside the component
const LANGUAGE_OPTIONS = ["en", "hi"];
const NAVIGATION_LINKS = [
  { label: "My Profile", route: "Profile" },
  { label: "Bookmark News", route: "BookmarkNews" },
  { label: "Terms of Service", route: "TermsOfService" },
  { label: "Contact Us", route: "ContactUs" },
];

const Settings = () => {
  const router = useRouter();
  const dynamicStyles = UseDynamicStyles();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, updateLanguage } = useLanguage();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => setDropdownVisible((prev) => !prev);

  const handleLanguageChange = (langCode) => {
    updateLanguage(langCode);
    setDropdownVisible(false);
  };

  const languageLabel = useMemo(
    () => (language === "en" ? "English" : "Hindi"),
    [language]
  );

  const renderLanguageDropdown = () => (
    <View style={tw`absolute top-10 right-4 z-10`}>
      <View
        style={tw`absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-transparent border-b-gray-200`}
      />
      <View
        style={[
          tw`mt-2 rounded-lg shadow-lg w-32 bg-white`,
          dynamicStyles.footerBackgroundColor,
        ]}
      >
        {LANGUAGE_OPTIONS.map((langCode) => (
          <TouchableOpacity
            key={langCode}
            onPress={() => handleLanguageChange(langCode)}
            style={tw`p-2 border-b border-gray-200`}
          >
            <Text style={[tw`text-base`, dynamicStyles.footerTextColor]}>
              {langCode === "en" ? "English" : "Hindi"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[tw`flex-1 px-4`, dynamicStyles.backgroundColor]}>
      <Text style={[tw`text-2xl mt-6 font-bold`, dynamicStyles.textColor]}>
        Settings
      </Text>

      {/* Dark Mode Toggle */}
      <View
        style={tw`py-3 border-b border-gray-300 flex-row items-center justify-between`}
      >
        <Text style={[tw`text-base`, dynamicStyles.textColor]}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      {/* Navigation Links */}
      {NAVIGATION_LINKS.map(({ label, route }) => (
        <TouchableOpacity
          key={label}
          style={tw`py-3 border-b border-gray-300 flex-row items-center justify-between`}
          onPress={() => router.push(route)}
        >
          <Text style={[tw`text-base`, dynamicStyles.textColor]}>{label}</Text>
        </TouchableOpacity>
      ))}

      {/* Language Selection */}
      <View style={tw`py-3 border-b border-gray-300 relative`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text style={[tw`text-base`, dynamicStyles.textColor]}>Language</Text>
          <TouchableOpacity
            onPress={toggleDropdown}
            style={tw`flex-row items-center`}
          >
            <Text style={[tw`text-base mr-2`, dynamicStyles.textColor]}>
              {languageLabel}
            </Text>
            <Ionicons
              name={dropdownVisible ? "chevron-up" : "chevron-down"}
              size={16}
              color={dynamicStyles.textColor.color}
            />
          </TouchableOpacity>
          {dropdownVisible && renderLanguageDropdown()}
        </View>
      </View>
    </View>
  );
};

export default Settings;
