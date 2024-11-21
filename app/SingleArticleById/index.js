import { gql } from "@apollo/client";
import Article from "../../components/Article";
import client from "../../context/ApolloClient";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const GET_ARTICLE_BY_ID = gql`
  query GetArticleById($id: Int!) {
    article(id: $id) {
      id
      title
      description
      imageURL
    }
  }
`;

const SingleArticleById = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const { articleId } = useLocalSearchParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await client.query({
          query: GET_ARTICLE_BY_ID,
          variables: { id: parseInt(articleId) },
        });
        setArticle(data.article);
      } catch (err) {
        setError(`Error fetching article: ${err.message}`);
      }
    };
    fetchArticle();
  }, [articleId]);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const { title, imageURL, description } = article;

  return (
    <Article
      title={title}
      imageURL={imageURL}
      description={description}
      onBackPress={router.back}
    />
  );
};

export default SingleArticleById;
