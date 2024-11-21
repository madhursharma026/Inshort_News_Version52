import {
  View,
  Text,
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import { useLanguage } from "../../context/LanguageContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const languages = [
  { label: "Hindi", value: "hi" },
  { label: "English", value: "en" },
];

const Screen3 = () => {
  const router = useRouter();
  const languageButtonRef = useRef(null);
  const { updateLanguage } = useLanguage();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  const handleGetStarted = async () => {
    if (!selectedLanguage) {
      Alert.alert("Selection Required", "Please select a language to proceed!");
      return;
    }
    await AsyncStorage.multiSet([
      ["hasLaunched", "true"],
      ["selectedLanguage", selectedLanguage],
    ]);
    router.replace("/(tabs)");
  };

  const toggleDropdown = () => {
    if (!dropdownVisible) {
      languageButtonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({ top: y + height, left: x });
      });
    }
    setDropdownVisible(!dropdownVisible);
  };

  const handleLanguageChange = (label, code) => {
    setSelectedLanguage(code);
    updateLanguage(code);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#E0F7FA]">
      <TouchableOpacity
        className="absolute top-4 left-4 p-2 elevation-3 rounded bg-white"
        onPress={() => router.back()}
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color="#004D40" />
      </TouchableOpacity>
      <View className="flex-1 items-center px-5 justify-center">
        <Image
          source={require("../../assets/favicon.png")}
          className="w-[200px] h-[200px] mb-5"
          accessibilityLabel="App logo"
        />
        <Text className="text-2xl text-[#004D40] mb-3 font-bold">
          Stay Updated Instantly
        </Text>
        <Text className="text-base text-[#00796B] mb-5 text-center leading-6">
          The third screen allows you to select your preferred language. Choose
          from a variety of languages to enhance your news experience.
        </Text>

        <TouchableOpacity
          ref={languageButtonRef}
          onPress={toggleDropdown}
          className="p-2 border border-[#004D40] rounded mb-5 flex-row items-center bg-white"
          accessibilityLabel="Select Language"
        >
          <Text className="text-base mr-2 text-black">
            {selectedLanguage
              ? languages.find((lang) => lang.value === selectedLanguage)?.label
              : "Select Language"}
          </Text>
          <Ionicons
            name={dropdownVisible ? "chevron-up" : "chevron-down"}
            size={16}
            color="black"
          />
        </TouchableOpacity>

        {dropdownVisible && (
          <View
            className="absolute z-10 w-40 rounded shadow-md bg-[#282C35]"
            style={dropdownPosition}
          >
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => handleLanguageChange(lang.label, lang.value)}
                className="p-2 w-full border-b border-gray-300"
                accessibilityLabel={`Select ${lang.label}`}
              >
                <Text className="text-base text-white">{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <Pressable
        className="m-5 p-4 rounded mb-10 items-center justify-center bg-[#007bff]"
        onPress={handleGetStarted}
        accessibilityLabel="Open News"
      >
        <Text className="text-base text-white font-bold">Open News</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Screen3;
