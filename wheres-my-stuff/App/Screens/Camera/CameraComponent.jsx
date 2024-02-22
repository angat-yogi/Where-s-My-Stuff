import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from "react-native-vision-camera";
import { useFocusEffect } from "@react-navigation/native";

export default function CameraComponent() {
  const [isActive, setIsActive] = useState(false);
  const device = useCameraDevice("back", {
    physicalDevices: [
      "ultra-wide-angle-camera",
      "wide-angle-camera",
      "telephoto-camera",
    ],
  });

  useFocusEffect(
    useCallback(() => {
      setIsActive(true);
      return () => {
        console.log("Camera not used");
        setIsActive(false);
      };
    })
  );
  if (device == null) return <Text>No device found</Text>;

  const { hasPermission, requestPermission } = useCameraPermission();
  const cameraRef = useRef(null);

  const onTakePicturePress = async () => {
    console.log("Taking picture");
    const photo = await cameraRef.current.takePhoto();
    console.log(photo);
  };
  console.log("Camera Component: ", hasPermission);
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);
  if (!hasPermission) {
    return <ActivityIndicator />;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />
      <Pressable
        onPress={onTakePicturePress}
        style={{
          position: "absolute",
          bottom: 50,
          width: 75,
          height: 75,
          backgroundColor: "white",
          borderRadius: 75,
          alignSelf: "center",
        }}
      />
    </View>
  );
}
