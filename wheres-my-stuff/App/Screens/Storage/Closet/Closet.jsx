import { Image, StyleSheet, Dimensions, ScrollView, ImageBackground, Animated, View, TextInput, TouchableOpacity, Text, Alert } from "react-native";
import { PanResponder } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "../../../API/GlobalApi";
import Gallery from "../../../Shared/Gallery";
import Colors from "../../../Utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Search from "../../../Shared/Search";
import { useUser } from "@clerk/clerk-expo";
import {MediaLibrary } from 'expo'
// import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Closet() {
  const navigation = useNavigation();

  const storageName = "Closet";
  const { user, isLoading } = useUser();
  const [storageTypes, setStorageTypes] = useState();
  const [storageContents, setStorageContents] = useState([]);

  const [closet, setCloset] = useState();
  const [closetImages, setClosetImages] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [imagePositions, setImagePositions] = useState([]);

  const handleImagesSelected = (selectedImages) => {
    setClosetImages(selectedImages);
    console.log(closetImages);
  };

  const getClosetsContents = () => {
    GlobalApi.getClosetsContents().then((resp) => {
      const userEmail = user?.emailAddresses[0]?.emailAddress;
    const matchingStorages = resp.userStorages.filter((storage) => storage.userEmail === userEmail);
    
    // Initialize an array to store all matching image URIs
    let allImageUris = [];
    
    // Iterate through each matching storage object
    matchingStorages.forEach((storage) => {
      // Split the image URIs by comma and concatenate them to the allImageUris array
      const imageUris = storage.imageUri.split(',');
      allImageUris = allImageUris.concat(imageUris);
    });
    
    // Set the concatenated image URIs to the storageContents state variable
    setStorageContents(allImageUris);
    });
  };

  const getStorageTypes = () => {
    GlobalApi.getStorageTypes().then((resp) => {
      setStorageTypes(resp?.storageTypes);
    });
  };

  useEffect(() => {
    getStorageTypes();
    getClosetsContents();
  }, []);

  useEffect(() => {
    if (storageContents.length > 0) {
      const initialPositions = storageContents.map(() => new Animated.ValueXY());
      setImagePositions(initialPositions);
    }
  }, [storageContents]);

  useEffect(() => {
    const item = storageTypes?.find((x) => x.storageTypeName === storageName);
    if (item != null) {
      setCloset(item);
    }
  }, [storageTypes]);

  


  useEffect(() => {
    // Update coordinates when pan changes
    pan.addListener((value) => {
      setCoordinates({ x: value.x, y: value.y });
    });
    return () => {
      pan.removeAllListeners();
    };
  }, []);
  const pan = useRef(new Animated.ValueXY()).current;

const imageCoordinates={};
const panResponders = storageContents.map((_, index) => {
  if (imagePositions[index]) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // Log the position of the dragged image
        console.log(`Image ${index} Position: x=${gesture.dx}, y=${gesture.dy}`);
        imageCoordinates[index] = { x: gesture.dx, y: gesture.dy };
        // Update the position of the image
        Animated.event(
          [null, { dx: imagePositions[index].x, dy: imagePositions[index].y }],
          { useNativeDriver: false }
        )(event, gesture);
      },
    });
  } else {
    return PanResponder.create({}); // Create an empty PanResponder if position is undefined
  }
});



  const saveImagesToDb=async()=>{
    console.log(imageCoordinates)
    if(storageContents.length>0){
      const data = {
        userId: user?.emailAddresses[0]?.emailAddress,
        imageUrl:closetImages
      };
    console.log(imagePositions)
      console.log("data",data);
      if(data.imageUrl.length>0){
        GlobalApi.addclosetContents(data).then(async(resp) => {
          console.log(resp);
          // Save images to gallery
          for (const uri of closetImages) {
            const asset = await MediaLibrary.createAssetAsync(uri);
            const assetUri = await MediaLibrary.getAssetInfoAsync(asset);
            console.log("Asset URI:", assetUri.uri);
          }
        });
      }
      else {
        console.log("No images to save in data");
        navigation.navigate("home");

      }
      
    } else {
      console.log("No images to save in storage");
      navigation.navigate("home");

    }
  }
  
  return closet ? (
    <View style={styles.container}>
     <Search/>

     <ScrollView contentContainerStyle={styles.scrollViewContent}>
  {closet && (
    <ImageBackground
      style={styles.image}
      source={{ uri: closet.image.url }}
    >
      {storageContents.map((imageUri, index) => (
  <Animated.View
    key={index}
    style={[
      styles.box,
      {
        transform: [
          { translateX: imagePositions[index]?.x??0 },
          { translateY: imagePositions[index]?.y??0 },
          { rotate: "0deg" },
        ],
      },
    ]}
    {...panResponders[index].panHandlers}
  >
    <Image
      source={{ uri: imageUri }}
      style={styles.innerBox}
    />
  </Animated.View>
))}
    </ImageBackground>
  )}
  <Gallery
    onImagesSelected={handleImagesSelected}
    viewGallery={true}
  />
  <View style={{marginLeft:width/3 }}>
    <TouchableOpacity  
      style={[styles.button, { marginRight: 5 ,backgroundColor:Colors.BEIGE}]}  
      onPress={saveImagesToDb}
    >
      <Text style={{
          textAlign: "center",
          fontSize: 17,
          color: Colors.PRIMARY,
        }}
      >
        Close
      </Text>
    </TouchableOpacity>
  </View>
</ScrollView>

    </View>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: width,
    height: height * 0.8,
  },
  draggableImage: {
    width: 100,
    height: 100,
    position: "absolute",
    zIndex: 9999,
  },
  box: {
    position: "absolute",
    backgroundColor: "transparent",
  },
  innerBox: {
    height: 150,
    width: 150,
    backgroundColor: "blue",
    borderRadius: 5,
  },
  button: {
    width: "48%", // Adjust width as needed
    backgroundColor: Colors.WHITE,
    borderRadius: 99, // Example border radius, adjust as needed
    padding: 15, // Adjust padding as needed
    marginTop: 50,
  },
});
