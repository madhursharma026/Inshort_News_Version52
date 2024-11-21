import React from "react";
import Article from "../../components/Article";
import { useLocalSearchParams, useRouter } from "expo-router";

const SingleArticle = () => {
  const { title, imageURL, description } = useLocalSearchParams();

  return (
    <Article
      title={title}
      imageURL={imageURL}
      description={description}
      onBackPress={useRouter().back}
    />
  );
};

export default SingleArticle;
