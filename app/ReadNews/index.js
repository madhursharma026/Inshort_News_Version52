import tw from "twrnc";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useReadNews } from "../../context/ReadNewsContext";
import ReadSingleNews from "../../components/ReadSingleNews";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { View, Text, Dimensions, Button } from "react-native";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const ReadNews = () => {
  const router = useRouter();
  const { readArticles } = useReadNews();
  const dynamicStyles = UseDynamicStyles();

  // Custom animation style for the carousel
  const animationStyle = useCallback(
    (value) => {
      "worklet";
      const translateY = interpolate(value, [-1, 0, 1], [-windowHeight, 0, 0]);
      const scale = interpolate(value, [-1, 0, 1], [1, 1, 0.85]);
      return {
        transform: [{ translateY }, { scale }],
        zIndex: interpolate(value, [-1, 0, 1], [300, 0, -300]),
      };
    },
    [windowHeight]
  );

  // Renders a single news item in the carousel
  const renderCarouselItem = ({ item, index }) => (
    <ReadSingleNews item={item} index={index} />
  );

  // Renders the main content of the screen
  const renderContent = () => {
    if (readArticles.length === 0) {
      return <StatusMessage message="Haven't read any news yet!" />;
    }

    return (
      <Carousel
        loop={false}
        mode={"stack"}
        vertical={true}
        data={readArticles}
        width={windowWidth}
        height={windowHeight}
        renderItem={renderCarouselItem}
        customAnimation={animationStyle}
      />
    );
  };

  // Status message when no articles are read
  const StatusMessage = ({ message }) => (
    <View style={tw`items-center`}>
      <Text style={[tw`text-xl text-center mb-4`, dynamicStyles.textColor]}>
        {message}
      </Text>
      <Button title="Home Page" onPress={() => router.back()} />
    </View>
  );

  return (
    <View
      style={[
        dynamicStyles.backgroundColor,
        tw`flex-1 justify-center items-center`,
      ]}
    >
      {renderContent()}
    </View>
  );
};

export default ReadNews;
