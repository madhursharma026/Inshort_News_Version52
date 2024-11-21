import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { gql } from "@apollo/client";
import { useRouter } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import client from "../../context/ApolloClient";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import React, { useEffect, useState, useMemo } from "react";
import UseDynamicStyles from "../../context/UseDynamicStyles";

// GraphQL query
const GET_NEWS_BY_LANGUAGE_QUERY = gql`
  query {
    articles {
      id
      title
      imageURL
      createdAt
      description
    }
  }
`;

const DiscoverScreen = () => {
  const router = useRouter();
  const dynamicStyles = UseDynamicStyles();
  const { width } = useWindowDimensions();
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleArticles, setVisibleArticles] = useState(5);

  // Fetch articles using GraphQL
  const fetchArticles = async () => {
    console.log("Fetching articles...");
    setLoading(true); // Set loading state
    setError(null); // Reset error before fetching
    try {
      const { data } = await client.query({
        query: GET_NEWS_BY_LANGUAGE_QUERY,
        fetchPolicy: "network-only", // Force fresh data
      });
      console.log("Articles fetched:", data);
      setArticles(data.articles || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load articles. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const articlesToShow = useMemo(
    () => articles.slice(0, visibleArticles),
    [articles, visibleArticles]
  );

  if (loading) {
    return (
      <View
        style={[
          tw`flex-1 justify-center items-center`,
          dynamicStyles.backgroundColor,
        ]}
      >
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={[tw`mt-4`, dynamicStyles.textColor]}>
          Loading articles...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        tw`flex-grow p-2.5 pb-16`,
        dynamicStyles.backgroundColor,
      ]}
    >
      <View
        style={[
          tw`absolute top-0 right-0 -mt-44 -mr-40 w-80 h-80 rounded-full`,
          dynamicStyles.topQuaterCircle,
        ]}
      />

      <View style={tw`px-2.5 pb-9 pt-9`}>
        <Text
          style={[tw`text-4xl rounded-xl font-bold`, dynamicStyles.textColor]}
        >
          Inshorts Clone
        </Text>
        <Text style={[tw`text-sm text-gray-500`, dynamicStyles.textColor]}>
          Financial News made simple
        </Text>
      </View>

      <View style={tw`flex-1 p-2.5`}>
        <Text
          style={[
            tw`text-xl pb-4 font-bold`,
            dynamicStyles.textColor,
            { textDecorationLine: "underline" },
          ]}
        >
          All Articles
        </Text>

        {error ? (
          <View style={tw`flex-1 justify-center items-center mt-4`}>
            <Text style={tw`text-red-500 text-xl`}>{error}</Text>
            <TouchableOpacity
              onPress={fetchArticles}
              style={tw`p-2.5 mt-4 bg-red-500 rounded-lg`}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Retry, Fetch Articles
              </Text>
            </TouchableOpacity>
          </View>
        ) : articles.length === 0 ? (
          <View
            style={[
              tw`flex-1 justify-center items-center`,
              dynamicStyles.backgroundColor,
            ]}
          >
            <Text
              style={[tw`text-gray-500 text-xl mb-4`, dynamicStyles.textColor]}
            >
              No articles available.
            </Text>
            <TouchableOpacity
              onPress={fetchArticles}
              style={tw`p-2.5 bg-blue-500 rounded-lg`}
            >
              <Text style={tw`text-white text-center font-semibold`}>
                Reload Articles
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {articlesToShow.map((article) => (
              <TouchableOpacity
                key={article.id}
                onPress={() =>
                  router.push({
                    pathname: "/SingleArticle",
                    params: {
                      title: article.title,
                      imageURL: article.imageURL,
                      description: article.description,
                    },
                  })
                }
                activeOpacity={1}
                style={tw`mb-4`}
              >
                <View
                  style={tw`bg-white rounded-xl p-4 mb-4 shadow-lg shadow-blue-500`}
                >
                  <View style={tw`flex-row`}>
                    <View style={tw`flex-1 pr-4`}>
                      <Text
                        style={tw`text-lg font-semibold mb-2 text-gray-900`}
                        numberOfLines={3}
                      >
                        {article.title}
                      </Text>
                    </View>
                    <Image
                      source={{ uri: article.imageURL }}
                      style={tw`w-16 h-16`}
                    />
                  </View>
                  <View style={tw`mt-2`}>
                    <RenderHTML
                      contentWidth={width}
                      source={{
                        html: `${
                          article.description.length > 155
                            ? `${article.description.slice(0, 155)}...`
                            : article.description
                        }`,
                      }}
                      baseStyle={{ ...tw`text-base`, color: "#333" }}
                    />
                  </View>
                  <Text style={tw`text-xs text-gray-500 mt-2`}>
                    {formatDistanceToNow(new Date(article.createdAt), {
                      addSuffix: true,
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
            {visibleArticles < articles.length && (
              <TouchableOpacity
                onPress={() => setVisibleArticles((prev) => prev + 2)}
                style={tw`p-2.5 bg-blue-500 rounded-lg`}
              >
                <Text style={tw`text-white text-center font-semibold`}>
                  More Articles
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default DiscoverScreen;
