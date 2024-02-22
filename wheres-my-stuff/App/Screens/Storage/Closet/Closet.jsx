import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { PanResponder } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "../../../API/GlobalApi";
import Gallery from "../../../Shared/Gallery";

export default function Closet() {
  const storageName = "Closet";
  const [storageTypes, setStorageTypes] = useState();
  const [closet, setCloset] = useState();
  const getStorageTypes = () => {
    GlobalApi.getStorageTypes().then((resp) => {
      setStorageTypes(resp?.storageTypes);
    });
  };

  useEffect(() => {
    getStorageTypes();
  }, []);
  useEffect(() => {
    const item = storageTypes?.find((x) => x.storageTypeName === storageName);
    if (item != null) {
      setCloset(item);
    }
  }, [storageTypes]);

  return closet ? (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <Image style={styles.image} source={{ uri: closet.image.url }} />
      <Gallery />
    </ScrollView>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.8,
    resizeMode: "cover",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
