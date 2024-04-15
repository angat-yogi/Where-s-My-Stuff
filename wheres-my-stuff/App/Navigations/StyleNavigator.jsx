import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RecommendedStyleScreen from "../Screens/Style/RecommendedStyleScreen";
import StyleScreen from "../Screens/Style/StyleScreen";

const Stack = createStackNavigator();
export default function StyleNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecommendStyle" component={RecommendedStyleScreen} />
      <Stack.Screen name="style" component={StyleScreen} />
    </Stack.Navigator>
  );
}
