import React, { useEffect, useState } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import TabNavigator from "./TabNavigator";
import Preference from "../Screens/PreferenceScreen/Preference";
import { useUser } from "@clerk/clerk-expo";
import { ActivityIndicator } from "react-native";

const Drawer = createDrawerNavigator();

export default function ProfileNavigator() {
  const { isLoading, user } = useUser();
const [loading, setLoading] = useState(false);
const [users, setUsers] = useState([]);
const [firstLogin, setFirstLogin] = useState(false);

const doesEmailExist = (emailAddress) => {
  let count=0;
   users.some(user => {
        if (user.email_addresses[0].email_address === emailAddress) {
            count++;
        }
    });
if(count>0){
  setFirstLogin(false)
}
else{
  setFirstLogin(true)
}

};

useEffect( () => {
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
            setLoading(false); 
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    setLoading(true);
   fetchUsers();
}, []);

useEffect(() => {
    if (!loading && users.length > 0) {
        doesEmailExist(user.emailAddresses[0].emailAddress);
    }
}, [loading, users,firstLogin]);


if (loading) {
    return <ActivityIndicator size="large" color="black" />;
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
           name="home"
           options={{ drawerLabel: () => null }}
           component={TabNavigator}
           initialParams={{ refresh:true }}
         />
       </>
      ) : (
        <>
        <Drawer.Screen
           name="home"
           options={{ drawerLabel: () => null }}
           component={TabNavigator}
           initialParams={{ refresh:true }}
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
