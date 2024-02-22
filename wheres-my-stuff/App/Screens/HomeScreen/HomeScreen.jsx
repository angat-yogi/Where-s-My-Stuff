import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Slider from "./Slider";
import GlobalApi from "../../API/GlobalApi";

export default function HomeScreen() {
  const [categories, setCategories] = useState();
  const [fashions, setFashions] = useState();
  const [storageTypes, setStorageTypes] = useState();
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
  const getStorageTypes = () => {
    GlobalApi.getStorageTypes().then((resp) => {
      setStorageTypes(resp?.storageTypes);
    });
  };
  const sortedFashions = fashions?.sort((a, b) => b.noOfClicks - a.noOfClicks);

  useEffect(() => {
    getCategories();
    getTrendingFashions();
    getStorageTypes();
  }, []);
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
        <Slider
          isViewAll={true}
          heading="Places To Store"
          data={storageTypes}
          styleImage={styles.imageFashion}
        />
      </View>
    </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
  },
});
