import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
} from "react-native-vision-camera";

export default function CameraComponent() {
  const device = useCameraDevice("back");
  if (device == null) return <Text>No device found</Text>;
  const { hasPermission, requestPermission } = useCameraPermission();

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
    <View>
      <Camera device={device} isActive={true} />
    </View>
  );
}
