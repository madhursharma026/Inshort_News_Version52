import tw from "twrnc";
import { useRouter } from "expo-router";
import React, { useCallback, memo } from "react";
import { interpolate } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { useBookmarks } from "../../context/BookmarkContext";
import { Text, View, Dimensions, Button } from "react-native";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import BookmarkSingleNews from "../../components/BookmarkSingleNews";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const BookmarkNews = () => {
  const router = useRouter();
  const dynamicStyles = UseDynamicStyles();
  const { bookmarkedArticles } = useBookmarks();

  const animationStyle = useCallback((value) => {
    "worklet";
    return {
      transform: [
        { translateY: interpolate(value, [-1, 0, 1], [-windowHeight, 0, 0]) },
        { scale: interpolate(value, [-1, 0, 1], [1, 1, 0.85]) },
      ],
      zIndex: interpolate(value, [-1, 0, 1], [300, 0, -300]),
    };
  }, []);

  const StatusMessage = memo(({ message }) => (
    <View style={tw`items-center`}>
      <Text style={[tw`text-xl text-center mb-4`, dynamicStyles.textColor]}>
        {message}
      </Text>
      <Button title="Home Page" onPress={() => router.back()} />
    </View>
  ));

  const renderContent = () =>
    bookmarkedArticles.length === 0 ? (
      <StatusMessage message="There are no bookmarks" />
    ) : (
      <Carousel
        loop={false}
        mode="stack"
        vertical
        data={bookmarkedArticles}
        width={windowWidth}
        height={windowHeight}
        renderItem={({ item, index }) => (
          <BookmarkSingleNews item={item} index={index} />
        )}
        customAnimation={animationStyle}
      />
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

export default BookmarkNews;
