import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Heading from "../../Shared/Heading";

export default function Slider({ data, heading, isViewAll, styleImage }) {
  const navigation = useNavigation();
  const openAssociatedComponent = (storageName) => {
    console.log(storageName);
    if (storageName === "Closet") {
      navigation.navigate(storageName?.toLowerCase());
    } else {
      return;
    }
  };
  return (
    <View>
      <View style={styles.categories}>
        <Heading text={heading} isViewAll={isViewAll} />
        <FlatList
          data={data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                openAssociatedComponent(item.storageTypeName || null)
              }
              style={{ marginRight: 20, alignItems: "center" }}
            >
              <Text style={styles.categoryName}>
                {item.name || item.storageTypeName}
              </Text>
              <Image
                style={styleImage}
                source={{
                  uri:
                    item?.displayImage?.url ||
                    item.image[0]?.url ||
                    item.image.url ||
                    null,
                }}
              />
            </TouchableOpacity>
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
  categoryName: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
});
