import { View, Text } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import TabNavigator from "./TabNavigator";
const Drawer = createDrawerNavigator();

export default function ProfileNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ProfileScreen {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen
        name="Go Back"
        options={{ drawerLabel: () => null }}
        component={TabNavigator}
      />
    </Drawer.Navigator>
  );
}
