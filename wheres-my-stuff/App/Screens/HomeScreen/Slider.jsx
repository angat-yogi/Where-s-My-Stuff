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

export default function Slider() {
  const [slider, setSlider] = useState();
  const getCategories = () => {
    GlobalApi.getCategories().then((resp) => {
      setSlider(resp?.categories);
    });
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <View style={styles.categories}>
      <Text style={styles.heading}>Categories For You</Text>
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
  categoryName: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
});
