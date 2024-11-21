import {
  Text,
  View,
  Modal,
  Alert,
  Image,
  Button,
  Platform,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import tw from "twrnc";
import { APIURL } from "@env";
import { Video } from "expo-av";
import ImageViewer from "../ImageViewer";
import RenderHTML from "react-native-render-html";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React, { useEffect, useRef, useState } from "react";
import { useBookmarks } from "../../context/BookmarkContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import he from "he"; // Import the 'he' library for HTML decoding

const imageHeight = Dimensions.get("window").height * 0.3;

const formatDate = (dateString) => {
  if (!dateString) return "unknown";
  const date = new Date(dateString);
  return `${date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })} (${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  })})`;
};

const SingleNewsById = () => {
  const router = useRouter();
  const videoRef = useRef(null);
  const { width } = useWindowDimensions();
  const [error, setError] = useState(null);
  const dynamicStyles = UseDynamicStyles();
  const { newsId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState(null);
  const [reportText, setReportText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const { bookmarkedArticles, toggleBookmark } = useBookmarks();
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const isBookmarked = bookmarkedArticles.some((a) => a.url === newsData?.url);
  const paddingBottomClass = Platform.OS === "ios" ? "pb-[70px]" : "pb-[70px]";

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://192.168.1.33:5001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query GetNewsById($id: Int!) {
              newsById(id: $id) {
                id
                url
                title
                author
                language
                sourceURL
                description
                publishedAt
                readMoreContent
                sourceURLFormate
              }
            }
          `,
          variables: { id: parseInt(newsId) },
        }),
      });
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      setNewsData(result.data.newsById);
    } catch (err) {
      setError(err.message || "Failed to fetch news data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newsId) fetchNewsData();
  }, [newsId]);

  const handleImagePress = (imageURI) => {
    setSelectedImageUri(imageURI);
    setIsModalVisible(true);
  };

  const handleReportPress = () => {
    setIsReportModalVisible(true);
  };

  const handleCancelReport = () => {
    setIsReportModalVisible(false);
    setReportText("");
  };

  const handleSubmitReport = async () => {
    if (reportText.trim() === "") {
      Alert.alert(
        "Report",
        "Please enter a reason for reporting this article."
      );
      return;
    }

    try {
      const response = await fetch("http://192.168.1.33:5001/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation CreateReport($createReportInput: CreateReportInput!) {
              createReport(createReportInput: $createReportInput) {
                id
                details
                newsId
              }
            }
          `,
          variables: {
            createReportInput: {
              details: reportText,
              newsId: newsData.id,
            },
          },
        }),
      });
      const result = await response.json();
      if (result.errors) throw new Error(result.errors[0].message);
      Alert.alert("Report Submitted", "Thank you for your feedback.");
      setIsReportModalVisible(false);
      setReportText("");
    } catch {
      Alert.alert("Error", "Failed to submit the report. Please try again.");
    }
  };

  const handleVideoError = () => {
    // Handle video error
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={tw`mt-4 text-lg text-gray-700`}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <Text style={tw`text-xl font-bold text-red-500`}>Error</Text>
        <Text style={tw`text-base text-gray-600 mt-2`}>{error}</Text>
        <Button title="Retry" onPress={fetchNewsData} />
      </View>
    );
  }

  if (!newsData) return null;

  return (
    <View style={[tw`relative w-full h-full ${paddingBottomClass}`]}>
      <View style={tw`bg-white`}>
        {newsData.sourceURLFormate === "video" ? (
          <Video
            ref={videoRef}
            source={{ uri: newsData.sourceURL }}
            style={tw`w-full h-[${imageHeight}px]`}
            useNativeControls
            resizeMode="contain"
            onError={handleVideoError}
          />
        ) : (
          <TouchableOpacity
            onPress={() => handleImagePress(newsData.sourceURL)}
          >
            <Image
              source={{ uri: newsData.sourceURL }}
              style={tw`w-full h-[${imageHeight}px]`}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleReportPress}
          style={tw`absolute top-2 right-2 bg-red-500 p-2 rounded-full`}
        >
          <Text style={tw`text-white text-xs font-bold`}>Report News</Text>
        </TouchableOpacity>
      </View>

      <View style={[tw`flex-1 p-4`, dynamicStyles.backgroundColor]}>
        <Text style={[tw`text-xl pb-2`, dynamicStyles.textColor]}>
          {he.decode(newsData.title)}
        </Text>
        <RenderHTML
          contentWidth={width}
          source={{ html: newsData.description }}
          baseStyle={{
            ...tw`text-base font-light`,
            ...dynamicStyles.textColor,
          }}
        />

        <View style={tw`flex-row items-center justify-between`}>
          <Text style={dynamicStyles.textColor}>
            Short by{" "}
            <Text style={tw`font-bold`}>{newsData.author ?? "unknown"}</Text>
          </Text>
          <TouchableOpacity
            onPress={() => toggleBookmark(newsData)}
            style={tw`p-2`}
          >
            <FontAwesome
              name={isBookmarked ? "bookmark" : "bookmark-o"}
              size={24}
              color={
                isBookmarked
                  ? dynamicStyles.footerBackgroundColor
                  : dynamicStyles.textColor.color
              }
            />
          </TouchableOpacity>
        </View>

        <Text style={dynamicStyles.textColor}>
          Created:{" "}
          <Text style={tw`font-bold`}>
            {formatDate(newsData.publishedAt) ?? "unknown"}
          </Text>
        </Text>
      </View>

      <ImageViewer
        visible={isModalVisible}
        imageUri={selectedImageUri}
        onClose={() => setIsModalVisible(false)}
      />

      <View
        style={[
          tw`absolute bottom-0 w-full h-24 px-4 justify-center`,
          dynamicStyles.footerBackgroundColor,
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/LinkViewer",
              params: { LinkURL: newsData.url },
            })
          }
        >
          <Text
            style={[tw`text-base`, dynamicStyles.footerTextColor]}
            numberOfLines={2}
          >
            {newsData?.readMoreContent}
          </Text>
          <Text
            style={[tw`text-base font-bold`, dynamicStyles.footerTextColor]}
          >
            Read More...
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelReport}
      >
        <View
          style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}
        >
          <View style={tw`bg-white p-6 rounded-lg w-4/5`}>
            <Text style={tw`text-lg font-bold mb-4`}>Report News</Text>
            <TextInput
              style={tw`border border-gray-300 p-3 mb-4 rounded text-base h-32`}
              placeholder="Enter your reason for reporting"
              value={reportText}
              onChangeText={setReportText}
              multiline
              textAlignVertical="top"
            />

            <View style={tw`flex-row justify-between`}>
              <Button title="Cancel" onPress={handleCancelReport} />
              <Button title="Submit" onPress={handleSubmitReport} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SingleNewsById;
