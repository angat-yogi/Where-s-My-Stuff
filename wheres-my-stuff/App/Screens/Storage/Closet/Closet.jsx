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
  const [recentImages, setRecentImages] = useState([]);

  const getStorageTypes = () => {
    GlobalApi.getStorageTypes().then((resp) => {
      setStorageTypes(resp?.storageTypes);
    });
  };

  const handleImagesSelected = (images) => {
    setRecentImages(images);
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
      <Gallery onImagesSelected={handleImagesSelected} />
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {recentImages.map((imageUri, index) => (
          <Image
            key={index}
            source={{ uri: imageUri }}
            style={{ width: 100, height: 100 }}
          />
        ))}
      </View>
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
