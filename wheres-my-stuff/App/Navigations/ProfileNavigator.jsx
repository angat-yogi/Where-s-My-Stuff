import React, { useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import TabNavigator from "./TabNavigator";
import Preference from "../Screens/PreferenceScreen/Preference";

const Drawer = createDrawerNavigator();

export default function ProfileNavigator() {
  const [firstLogin, setFirstLogin] = useState(true);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <ProfileScreen {...props} />}
      screenOptions={{ headerShown: false }}
    >
      {firstLogin ? (
         <>
         <Drawer.Screen
           name="Preference"
           options={{ drawerLabel: () => null }}
           component={Preference}
         />
         <Drawer.Screen
           name="Go Back"
           options={{ drawerLabel: () => null }}
           component={TabNavigator}
         />
       </>
      ) : (
        <Drawer.Screen
           name="Go Back"
           options={{ drawerLabel: () => null }}
           component={TabNavigator}
         />
      )}
    </Drawer.Navigator>
  );
}
