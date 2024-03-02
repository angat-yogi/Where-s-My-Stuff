import {
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Animated,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { PanResponder } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "../../../API/GlobalApi";
import Gallery from "../../../Shared/Gallery";
import Colors from "../../../Utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Search from "../../../Shared/Search";
import { useUser } from "@clerk/clerk-expo";


const { width, height } = Dimensions.get("window");

export default function Closet() {
  const storageName = "Closet";
  const { user, isLoading } = useUser();
  const [storageTypes, setStorageTypes] = useState();
  const [storageContents, setStorageContents] = useState([]);

  const [closet, setCloset] = useState();
  const [closetImages, setClosetImages] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const handleImagesSelected = (selectedImages) => {
    setClosetImages(selectedImages);
    console.log(closetImages);
  };

  const getClosetsContents = () => {
    GlobalApi.getClosetsContents().then((resp) => {
      const previousContents= resp?.userStorages[0].imageUri.split(',');
      console.log(previousContents)
      setStorageContents(previousContents);
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
    const item = storageTypes?.find((x) => x.storageTypeName === storageName);
    if (item != null) {
      setCloset(item);
    }
  }, [storageTypes]);

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
    })
  ).current;

  useEffect(() => {
    // Update coordinates when pan changes
    pan.addListener((value) => {
      setCoordinates({ x: value.x, y: value.y });
    });
    return () => {
      pan.removeAllListeners();
    };
  }, []);

  const saveImagesToDb=()=>{
    if(closetImages.length>0){
      const data = {
        userId: user?.emailAddresses[0]?.emailAddress,
        imageUrl:closetImages
      };
  
      console.log("data",data);
      GlobalApi.addclosetContents(data).then((resp) => {
        console.log(resp)
            });
    }else{
      console.log("No images to save")
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
          <Animated.View
            style={[
              styles.box,
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { rotate: "0deg" },
                ],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {storageContents.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.innerBox}
              />
            ))}
          </Animated.View>
        </ImageBackground>
      )}
      <Gallery
        onImagesSelected={handleImagesSelected}
        viewGallery={true}
      />
      <View style={{marginLeft:width/3 }}>
      <TouchableOpacity  style={[styles.button, { marginRight: 5 ,backgroundColor:Colors.BEIGE}]}  
      onPress={saveImagesToDb}>
          <Text style={{
              textAlign: "center",
              fontSize: 17,
              color: Colors.PRIMARY,
            }}>Close</Text>
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
