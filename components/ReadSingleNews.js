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
  useWindowDimensions,
} from "react-native";
import tw from "twrnc";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import ImageViewer from "../app/ImageViewer";
import React, { useRef, useState } from "react";
import RenderHTML from "react-native-render-html";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import UseDynamicStyles from "../context/UseDynamicStyles";
const imageHeight = windowHeight * 0.3;

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

const ReportModal = ({
  visible,
  onClose,
  reportText,
  setReportText,
  onSubmit,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={tw`flex-1 justify-center items-center bg-black bg-opacity-50`}>
      <View style={tw`bg-white p-6 rounded-lg w-4/5`}>
        <Text style={tw`text-lg font-bold mb-4`}>Report Article</Text>
        <TextInput
          style={tw`border border-gray-300 p-3 mb-4 rounded text-base h-32`}
          placeholder="Enter your reason for reporting"
          value={reportText}
          onChangeText={setReportText}
          multiline
          textAlignVertical="top"
        />
        <View style={tw`flex-row justify-between`}>
          <Button title="Cancel" onPress={onClose} />
          <Button title="Submit" onPress={onSubmit} />
        </View>
      </View>
    </View>
  </Modal>
);

const ReadSingleNews = ({ item }) => {
  const videoRef = useRef(null);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [status, setStatus] = useState({});
  const [reportText, setReportText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const dynamicStyles = UseDynamicStyles();

  if (!item) return null;

  const handleImagePress = (imageURI) => {
    setSelectedImageUri(imageURI);
    setIsModalVisible(true);
  };

  const handleReportSubmit = () => {
    if (reportText.trim() === "") {
      Alert.alert(
        "Report",
        "Please enter a reason for reporting this article."
      );
      return;
    }
    Alert.alert("Report Submitted", "Thank you for your feedback.");
    setIsReportModalVisible(false);
    setReportText("");
  };

  return (
    <View style={tw`relative w-full h-[${windowHeight}px} pb-[70px]`}>
      <View style={tw`bg-white`}>
        {item.sourceURLFormate === "video" ? (
          <Video
            ref={videoRef}
            isLooping
            useNativeControls
            resizeMode="contain"
            source={{ uri: item.sourceURL }}
            onPlaybackStatusUpdate={setStatus}
            style={tw`w-full h-[${imageHeight}px]`}
          />
        ) : (
          <TouchableOpacity onPress={() => handleImagePress(item.sourceURL)}>
            <Image
              source={{ uri: item.sourceURL }}
              style={tw`w-full h-[${imageHeight}px]`}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => setIsReportModalVisible(true)}
          style={tw`absolute top-2 right-2 bg-red-500 p-2 rounded-full`}
        >
          <Text style={tw`text-white text-xs font-bold`}>Report News</Text>
        </TouchableOpacity>
      </View>

      <View style={[tw`flex-1 p-4`, dynamicStyles.backgroundColor]}>
        <Text style={[tw`text-xl pb-2`, dynamicStyles.textColor]}>
          {item.title}
        </Text>
        <RenderHTML
          contentWidth={width}
          source={{ html: item.description }}
          baseStyle={{
            ...tw`text-base font-light`,
            ...dynamicStyles.textColor,
          }}
        />

        <View style={tw`flex-row items-center justify-between`}>
          <Text style={dynamicStyles.textColor}>
            Short by{" "}
            <Text style={tw`font-bold`}>{item.author ?? "unknown"}</Text>
          </Text>
        </View>
        <Text style={dynamicStyles.textColor}>
          Created:{" "}
          <Text style={tw`font-bold`}>
            {formatDate(item.publishedAt) ?? "unknown"}
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
              params: { LinkURL: item.url },
            })
          }
        >
          <Text
            style={[tw`text-base`, dynamicStyles.footerTextColor]}
            numberOfLines={2}
          >
            {item?.readMoreContent}
          </Text>
          <Text
            style={[tw`text-base font-bold`, dynamicStyles.footerTextColor]}
          >
            Read More
          </Text>
        </TouchableOpacity>
      </View>

      <ReportModal
        visible={isReportModalVisible}
        onClose={() => setIsReportModalVisible(false)}
        reportText={reportText}
        setReportText={setReportText}
        onSubmit={handleReportSubmit}
      />
    </View>
  );
};

export default ReadSingleNews;
