import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import React from "react";
import Colors from "../../Utils/Colors";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@clerk/clerk-expo";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useUser } from "@clerk/clerk-expo";
const { width } = Dimensions.get("screen");

export default function ProfileScreen(props) {
  const navigation = useNavigation();
  const { user, isLoading } = useUser();
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  const handleLogout = () => {
    // Navigate to the screen you want to slide in from the right
    navigation.navigate("Home", {
      /* Optional parameters here */
    });
  };

  return (
    <DrawerContentScrollView {...props}>
      <View>
        <ImageBackground
          style={{ height: 140, backgroundColor: Colors.PRIMARY }}
        >
          <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
        </ImageBackground>
        <View>
          <Text
            style={{
              fontSize: 15,
              color: "purple",
              marginTop: 70,
              fontFamily: "outfit",
              textAlign: "center",
            }}
          >
            {user?.firstName + " " + user?.lastName}
          </Text>
        </View>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <TouchableOpacity
          style={[styles.button, { marginRight: 5 }]}
          onPress={signOut}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 17,
              color: Colors.PRIMARY,
            }}
          >
            Log out
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.drawerlistContainer}>
        <DrawerItemList {...props} />
      </View>
    </DrawerContentScrollView>
  );
}
const styles = StyleSheet.create({
  button: {
    width: "48%", // Adjust width as needed
    backgroundColor: Colors.BEIGE,
    borderRadius: 99, // Example border radius, adjust as needed
    padding: 5, // Adjust padding as needed
    marginTop: 5,
    marginBottom: 1000,
    marginRight: 15,
  },
  userImage: {
    width: 100,
    height: 100,
    borderRadius: 110 / 2,
    position: "absolute",
    left: width / 2 - 110,
    bottom: -60,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  drawerlistContainer: {
    marginTop: 110 / 2 + 10,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     paddingTop: 40,
//     backgroundColor: Colors.PRIMARY,
//     borderBottomLeftRadius: 5,
//     borderBottomRightRadius: 25,
//     borderTopLeftRadius: 25,
//     borderToptomRightRadius: 5,
//   },

//   addContainer: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   textInput: {
//     padding: 10,
//     paddingHorizontal: 20,
//     backgroundColor: Colors.WHITE,
//     borderRadius: 10,
//     width: "85%",
//     fontSize: 16,
//     fontFamily: "outfit",
//   },
//   searchContainer: {
//     marginTop: 15,
//     display: "flex",
//     flexDirection: "row",
//     gap: 10,
//   },
//   searchButton: {
//     backgroundColor: Colors.BEIGE,
//     padding: 10,
//     borderRadius: 10,
//   },
// });
