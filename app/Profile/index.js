import {
  View,
  Text,
  Alert,
  Image,
  Modal,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import tw from "twrnc";
import { APIURL } from "@env";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfilePhoto, setEditedProfilePhoto] = useState("");

  // Fetch user details from AsyncStorage when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const storedPhoneNumber = await AsyncStorage.getItem(
          "loginUserPhoneNumber"
        );
        const storedName = await AsyncStorage.getItem("loginUserName");
        const storedProfilePhoto = await AsyncStorage.getItem(
          "loginUserProfilePhoto"
        );

        setIsLoggedIn(!!storedPhoneNumber);
        setPhoneNumber(storedPhoneNumber);
        setName(storedName || "");
        setProfilePhoto(
          storedProfilePhoto ||
            "https://img.freepik.com/premium-vector/man-profile-cartoon_18591-58482.jpg"
        );
      } catch (error) {
        Alert.alert("Error", "Failed to load user details.");
      }
    };

    fetchUserDetails();
  }, []);

  // Handle logout functionality
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove([
        "loginUserPhoneNumber",
        "loginUserSessionId",
        "loginUserProfile",
        "loginUserName",
        "loginUserProfilePhoto",
      ]);
      router.replace("/PhoneVerification");
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  // Handle saving of the edited name and profile photo
  const handleSaveProfile = async () => {
    if (!editedName.trim() && !editedProfilePhoto.trim()) {
      Alert.alert("Error", "Fields cannot be empty.");
      return;
    }

    try {
      const response = await fetch(APIURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            mutation updateUserProfile($phoneNumber: String!, $newName: String, $newProfilePhoto: String) {
              updateUserProfile(phoneNumber: $phoneNumber, newName: $newName, newProfilePhoto: $newProfilePhoto) {
                id
                phoneNumber
                name
                profilePhoto
              }
            }
          `,
          variables: {
            phoneNumber,
            newName: editedName || name,
            newProfilePhoto: editedProfilePhoto || profilePhoto,
          },
        }),
      });

      const result = await response.json();
      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      // Update AsyncStorage and state with new name and profile photo
      if (editedName) {
        await AsyncStorage.setItem("loginUserName", editedName);
        setName(editedName);
      }
      if (editedProfilePhoto) {
        await AsyncStorage.setItem("loginUserProfilePhoto", editedProfilePhoto);
        setProfilePhoto(editedProfilePhoto);
      }

      setEditedName("");
      setEditedProfilePhoto("");
      setIsEditingProfile(false);

      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  const closeModal = () => {
    setEditedName("");
    setEditedProfilePhoto("");
    setIsEditingProfile(false);
  };

  return (
    <SafeAreaView style={tw`flex-1 items-center justify-center bg-white px-5`}>
      {isLoggedIn ? (
        <>
          <Text style={tw`text-5xl font-bold mb-10 text-center`}>
            Profile Page
          </Text>
          <Image
            source={{ uri: profilePhoto }}
            style={tw`w-50 h-50 rounded-full mb-5`}
          />

          <View style={tw`w-full mb-5 py-2 px-4 flex-row items-center`}>
            <Text style={tw`text-xl text-black mr-2`}>Phone Number:</Text>
            <Text style={tw`text-xl text-black font-semibold`}>
              {phoneNumber || "Not available"}
            </Text>
          </View>

          <View style={tw`w-full mb-5 py-2 px-4 flex-row items-center`}>
            <Text style={tw`text-xl text-black mr-2`}>Name:</Text>
            <Text style={tw`text-xl text-black font-semibold`}>
              {name || "Not available"}
            </Text>
            <TouchableOpacity
              style={tw`ml-2 px-2 py-1 bg-blue-500 rounded`}
              onPress={() => setIsEditingProfile(true)}
            >
              <Text style={tw`text-white text-sm`}>Edit</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={tw`w-full rounded-full bg-red-600 py-3 mb-5 items-center`}
            onPress={handleLogout}
          >
            <Text style={tw`text-lg text-white font-semibold`}>Logout</Text>
          </TouchableOpacity>

          {isEditingProfile && (
            <Modal transparent={true} animationType="slide">
              <View
                style={tw`flex-1 justify-center items-center bg-gray-900 bg-opacity-50`}
              >
                <View
                  style={tw`w-80 bg-white p-5 rounded-lg shadow-lg items-center`}
                >
                  <Text style={tw`text-xl font-bold mb-5`}>Edit Profile</Text>
                  <TextInput
                    style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4`}
                    placeholder="Enter your name"
                    value={editedName}
                    onChangeText={setEditedName}
                  />
                  <TextInput
                    style={tw`w-full border border-gray-300 rounded px-3 py-2 mb-4`}
                    placeholder="Enter profile photo URL"
                    value={editedProfilePhoto}
                    onChangeText={setEditedProfilePhoto}
                  />
                  <View style={tw`flex-row`}>
                    <TouchableOpacity
                      style={tw`bg-blue-500 py-2 px-4 rounded mr-2`}
                      onPress={handleSaveProfile}
                    >
                      <Text style={tw`text-white`}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={tw`bg-gray-500 py-2 px-4 rounded`}
                      onPress={closeModal}
                    >
                      <Text style={tw`text-white`}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </>
      ) : (
        <TouchableOpacity
          style={tw`w-full rounded-full bg-blue-600 py-3 mb-5 items-center`}
          onPress={() => router.replace("/PhoneVerification")}
        >
          <Text style={tw`text-lg text-white font-semibold`}>Login</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Profile;
