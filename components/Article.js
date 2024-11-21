import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import he from "he";
import tw from "twrnc";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import ImageViewer from "../app/ImageViewer";
import RenderHTML from "react-native-render-html";
import Icon from "react-native-vector-icons/Ionicons";
import UseDynamicStyles from "../context/UseDynamicStyles";

const Article = ({ title, imageURL, description, onBackPress }) => {
  const { width } = useWindowDimensions();
  const dynamicStyles = UseDynamicStyles();
  const router = useRouter(); // Use the hook at the top level of the component
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState("");

  const handleImagePress = () => {
    setSelectedImageUri(imageURL);
    setIsModalVisible(true);
  };

  const handleLinkPress = (href) => {
    const articleId = href?.split("article")[1];
    if (articleId) {
      router.push(`/SingleArticleById?articleId=${articleId}`); // Use router here without calling the hook
    } else {
      console.warn("No valid article ID found in href");
    }
  };

  return (
    <ScrollView style={[tw`flex-1 p-4`, dynamicStyles.backgroundColor]}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <TouchableOpacity onPress={onBackPress}>
          <Icon
            name="arrow-back"
            size={24}
            color={dynamicStyles.textColor.color}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[
          tw`text-3xl font-bold mb-4 text-justify`,
          dynamicStyles.textColor,
        ]}
      >
        {title}
      </Text>

      <TouchableOpacity onPress={handleImagePress}>
        <Image
          source={{ uri: imageURL }}
          style={tw`w-full h-64 rounded-lg mb-4`}
          resizeMode="cover"
        />
      </TouchableOpacity>

      <RenderHTML
        contentWidth={width}
        source={{
          html: he
            .decode(description)
            .replace(
              /<a href="([^"]+)"[^>]*>(.*?)<\/a>/g,
              '<span data-href="$1">$2</span>'
            ),
        }}
        baseStyle={{
          fontSize: 18,
          lineHeight: 30,
          fontFamily: "serif",
          marginBottom: 30,
          textAlign: "justify",
          color: dynamicStyles.textColor.color,
        }}
        renderers={{
          span: (props) => {
            const href = props.tnode?.init?.domNode?.attribs["data-href"];
            return (
              <TouchableOpacity onPress={() => handleLinkPress(href)}>
                <Text style={tw`text-blue-500 underline`}>
                  {props.tnode?.init?.textNode?.data || "Link"}
                </Text>
              </TouchableOpacity>
            );
          },
        }}
      />

      <ImageViewer
        visible={isModalVisible}
        imageUri={selectedImageUri}
        onClose={() => setIsModalVisible(false)}
      />
    </ScrollView>
  );
};

export default Article;
