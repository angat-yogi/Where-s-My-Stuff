import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Gallery({ onImagesSelected }) {
  const [images, setImages] = useState([]);

  const pickImages = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    console.log(result);

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages(selectedImages);
      onImagesSelected(selectedImages);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick images from camera roll" onPress={pickImages} />
      {images.map((imageUri, index) => (
        <Image
          key={index}
          source={{ uri: imageUri }}
          style={{ width: 200, height: 200 }}
        />
      ))}
    </View>
  );
}
