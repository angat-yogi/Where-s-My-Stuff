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

export default function Slider({ data, heading, isViewAll, styleImage }) {
  return (
    <View>
      <View style={styles.categories}>
        <Heading text={heading} isViewAll={isViewAll} />
        <FlatList
          data={data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ marginRight: 20, alignItems: "center" }}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Image
                style={styleImage}
                source={{
                  uri:
                    item?.displayImage?.url ||
                    (item?.image && item.image[0]?.url) ||
                    null,
                }}
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
  categoryName: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
});
