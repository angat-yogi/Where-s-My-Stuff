import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
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
  const [refreshing, setRefreshing] = useState(false);

  // Function to handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    console.log("page refreshed")
    setRefreshing(false);
  };

  const sortedFashions = fashions?.sort((a, b) => b.noOfClicks - a.noOfClicks);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (isCloseToBottom({ layoutMeasurement, contentOffset, contentSize })) {
      onRefresh();
    }
  };
  useEffect(() => {
    getCategories();
    getTrendingFashions();
    getStorageTypes();
  }, []);
  return (
    <ScrollView onScroll={handleScroll}
    scrollEventThrottle={16} // Adjust scrollEventThrottle as needed
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}contentContainerStyle={styles.scrollViewContent}>
      <Header icon="camera" action="Camera" />
      <View style={{ padding: 20 }}>
        <Slider
          isViewAll={true}
          displayHeading={true}
          heading="Categories For You"
          data={categories}
          styleImage={styles.imageCategory}
        />
        <Slider
          isViewAll={false}
          displayHeading={true}
          heading="Trending Fashions"
          data={sortedFashions}
          styleImage={styles.imageFashion}
        />
        <Slider
          // isViewAll={false}
          plus={true}
          heading="Rooms"
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
