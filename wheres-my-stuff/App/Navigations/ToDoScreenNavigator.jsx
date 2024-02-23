import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import AddToDoScreen from "../Screens/ToDoScreen/AddToDoScreen";
import ToDoScreen from "../Screens/ToDoScreen/ToDoScreen";

const Stack = createStackNavigator();
export default function ToDoScreenNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="To Do Screen" component={ToDoScreen} />
      <Stack.Screen name="addToDo" component={AddToDoScreen} />
    </Stack.Navigator>
  );
}
