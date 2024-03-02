import React, { useState, useEffect } from "react";
import { Image, View, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Colors from "../Utils/Colors";
import { useNavigation } from "@react-navigation/native";
import ClothForm from "../Screens/Storage/Closet/ClothForm";

export default function Gallery({ onImagesSelected,viewGallery }) {
  const navigation = useNavigation();
  const [selectedImageUri, setSelectedImageUri] = useState(null); 
  const [images, setImages] = useState([]);
  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
    });

    console.log(result);

    if (!result.canceled) {
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...selectedImages]);
      onImagesSelected([...images, ...selectedImages]);
    }
    
  };

  const takePicture=async()=>{
    try {
      let result= await ImagePicker.launchCameraAsync({
        cameraType:ImagePicker.CameraType.back,
        allowsEditing:true,
        aspect:[4,3],
        quality:1
      });
      if (!result.cancelled) {
        setImages([...images, result.assets[0].uri]);
        onImagesSelected([...images, result.assets[0].uri]);

      }
      else{
        console.log("could not load image")
      }
    } catch (error) {
      Alert.alert('Error saving the picture: '+error)
    }
  }

  const handleImagePress = (imageUri) => {
    setSelectedImageUri(imageUri); // Set the selected image URI
    navigation.navigate("clothform", { imageUri }); // Pass imageUri as a route parameter
  };

  return viewGallery && (
    <View style={{ alignItems: "center", justifyContent: "space-around", flexDirection: "column" }}>
  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around"}}>
    <TouchableOpacity onPress={takePicture}>
      <EvilIcons name="camera" size={30} color={Colors.BEIGE} style={{ marginHorizontal: 10 }}/>
    </TouchableOpacity>
    <TouchableOpacity onPress={pickImages}>
      <FontAwesome name="files-o" size={30} color={Colors.BEIGE} style={{ marginHorizontal: 10 }}/>
    </TouchableOpacity>
  </View>
  <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
    {images.map((imageUri, index) => (
     <TouchableOpacity key={index} onPress={() => handleImagePress(imageUri)}>

      <Image
        key={index} // Use the URI as the key
        source={{ uri: imageUri }}
        style={{ width: 100, height: 100, margin: 5 }}
      />
      </TouchableOpacity>
    ))}
  </View>
</View>

  );
}
