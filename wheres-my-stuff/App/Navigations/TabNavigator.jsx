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
import HomeNavigator from "./HomeNavigator";
import ToDoScreenNavigator from "./ToDoScreenNavigator";
import StyleScreen from "../Screens/Style/StyleScreen";
import { FontAwesome6 } from '@expo/vector-icons';
import ShareMyStuffs from "../Screens/ShareMyStuffs/ShareMyStuffs";
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
        component={HomeNavigator}
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
        component={ToDoScreenNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="tool" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={FavoriteScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="favorite" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Style"
        component={StyleScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="wardrobe-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Share"
        component={ShareMyStuffs}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name="slideshare" size={size} color={color} />
          ),
        }}
      />    
    </Tab.Navigator>
  );
};

export default TabNavigator;
