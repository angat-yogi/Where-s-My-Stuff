import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Closet from "../Screens/Storage/Closet/Closet";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import CameraComponent from "../Screens/Camera/CameraComponent";
import ClothForm from "../Screens/Storage/Closet/ClothForm";
import Gallery from "../Shared/Gallery";
import Room from "../Screens/HomeScreen/Room/Room";
import Furniture from "../Screens/Storage/Furniture";

const Stack = createStackNavigator();
export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen name="closet" component={Closet} />
      <Stack.Screen name="gallery" component={Gallery} />
      <Stack.Screen name="Camera" component={CameraComponent} />
      <Stack.Screen name="clothform" component={ClothForm} />
      <Stack.Screen name="room" component={Room} />
      <Stack.Screen name="furniture" component={Furniture} />


    </Stack.Navigator>
  );
}
