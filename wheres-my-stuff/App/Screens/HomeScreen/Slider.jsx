import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../API/GlobalApi";
import Heading from "../../Shared/Heading";

export default function Slider() {
  const [slider, setSlider] = useState();
  const [fashions, setFashions] = useState();
  const getCategories = () => {
    GlobalApi.getCategories().then((resp) => {
      setSlider(resp?.categories);
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
      <View style={styles.categories}>
        <Heading text={"Categories For You"} isViewAll={true} />
        <FlatList
          data={slider}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ marginRight: 20, alignItems: "center" }}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Image
                style={styles.imageSlider}
                source={{ uri: item?.displayImage?.url }}
              />
            </View>
          )}
        />
      </View>
      <View style={styles.categories}>
        <Heading text={"Trending Fashions"} isViewAll={false} />
        <FlatList
          data={sortedFashions}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ marginRight: 20, alignItems: "center" }}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Image
                style={styles.imageFashion}
                source={{ uri: item?.image[0]?.url }}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontFamily: "ProtestRiot",
    marginBottom: 10,
  },
  categories: {
    fontSize: 20,
    fontFamily: "ProtestRiot",
    marginBottom: 10,
  },
  imageSlider: {
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
  categoryName: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
});
