import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Slider from "./Slider";
import GlobalApi from "../../API/GlobalApi";

export default function HomeScreen() {
  const [categories, setCategories] = useState();
  const [fashions, setFashions] = useState();
  const getCategories = () => {
    GlobalApi.getCategories().then((resp) => {
      setCategories(resp?.categories);
    });
  };
  const getTrendingFashions = () => {
    GlobalApi.getTrendingFashions().then((resp) => {
      setFashions(resp?.trendingFashions);
    });
  };
  const sortedFashions = fashions?.sort((a, b) => b.noOfClicks - a.noOfClicks);

  useEffect(() => {
    getCategories();
    getTrendingFashions();
  }, []);
  return (
    <View>
      <Header icon="camera" />
      <View style={{ padding: 20 }}>
        <Slider
          isViewAll={true}
          heading="Categories For You"
          data={categories}
          styleImage={styles.imageCategory}
        />
        <Slider
          isViewAll={false}
          heading="Trending Fashions"
          data={sortedFashions}
          styleImage={styles.imageFashion}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageCategory: {
    width: 220,
    height: 150,
    borderRadius: 20,
    objectFit: "fill",
  },
  imageFashion: {
    width: 220,
    height: 180,
    borderRadius: 20,
    objectFit: "fill",
  },
});
