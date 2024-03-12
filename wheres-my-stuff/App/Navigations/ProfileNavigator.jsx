import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import TabNavigator from "./TabNavigator";
import Preference from "../Screens/PreferenceScreen/Preference";
import { useUser } from "@clerk/clerk-expo";

const Drawer = createDrawerNavigator();

export default function ProfileNavigator() {
  const [firstLogin, setFirstLogin] = useState(true);
  const {isLoading,user}=useUser();

  const [users, setUsers] = useState([]);

  const doesEmailExist = (email) => {
    return users.some(user => user.email_addresses.some(address => address.email === email));
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://api.clerk.dev/v1/users', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer sk_test_78PTU6hpTzDdfWp4r3lg9V5qJd28BcuPzNS657cgCA',
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setUsers(data);
       // setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
       // setLoading(false);
      }
    };

    fetchUsers();
    determineFirstTimeLogIn();
  }, []);


  const determineFirstTimeLogIn=async ()=>{
    setFirstLogin(doesEmailExist(user.emailAddresses[0].emailAddress))
  }

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
        <>
        <Drawer.Screen
           name="Go Back"
           options={{ drawerLabel: () => null }}
           component={TabNavigator}
         />
         <Drawer.Screen
         name="Preference"
         options={{ drawerLabel: () => null }}
         component={Preference}
         
       />
       </>
      )}
    </Drawer.Navigator>
  );
}
