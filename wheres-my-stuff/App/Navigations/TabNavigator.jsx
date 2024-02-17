import React from "react";
import { View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import ToDoScreen from "../Screens/ToDoScreen/ToDoScreen";
import { AntDesign } from "@expo/vector-icons";
import Colors from "../Utils/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import FavoriteScreen from "../Screens/Favorite/FavoriteScreen";

const tabType = {
  HomeScreen,
  ProfileScreen,
  ToDoScreen,
  FavoriteScreen,
};
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBarHideOnKeyboard="true"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-assistant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="To Do"
        component={ToDoScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="tool" size={size} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="gender-male-female-variant"
              size={size}
              color={color}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
