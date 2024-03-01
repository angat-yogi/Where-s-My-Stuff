import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
export default function Gallery({ onImagesSelected }) {
  const [images, setImages] = useState([]);
  const [image,setImage]=useState()
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

  const takePicture=async()=>{
    console.log("opening camera but not working")
    try {
      let result= await ImagePicker.launchCameraAsync({cameraType:ImagePicker.CameraType.back,allowsEditing:true,aspect:[4,3],quality:1
      });

      if(!result.canceled){
        savePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error saving the picture: '+error)
    }
  }
  const savePicture=async(image)=>{
    try {
      setImage(image)
      setImages(image)
    } catch (error) {
      console.log('error in camera',error)
    }
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "space-around" ,flexDirection:"row"}}>
      <TouchableOpacity onPress={takePicture}>
      <EvilIcons name="camera" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImages}>
      <FontAwesome name="files-o" size={24} color="black" />
      </TouchableOpacity>
      {images.map((imageUri, index) => (
        <Image
          key={index}
          source={{ uri: imageUri }}
          style={{ width: 100, height: 100 }}
        />
      ))}
    </View>
  );
}
