import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function Header({ style, shouldDisplayProfile, icon }) {
  const { user, isLoading } = useUser();
  const navigation = useNavigation();
  const handleProfilePress = () => {
    navigation.openDrawer();
  };
  const handleCameraPress = () => {
    navigation.navigate("Camera"); //it is not working so can I use
  };

  return (
    user && (
      <View style={styles.container}>
        <View style={styles.addContainer}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleProfilePress}>
              <Image
                source={{ uri: user?.imageUrl }}
                style={styles.userImage}
              />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontSize: 13,
                  color: "purple",
                  fontFamily: "outfit",
                }}
              >
                Hello,{" "}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: Colors.BLACK,
                  fontFamily: "outfit-bold",
                }}
              >
                {user?.firstName}!
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleCameraPress}>
            <FontAwesome name={icon} size={24} color="black" />
          </TouchableOpacity>
        </View>
        {/* Search Section */}
        <View style={styles.searchContainer}>
          <TextInput placeholder="Search" style={styles.textInput} />
          <TouchableOpacity>
            <MaterialCommunityIcons
              style={styles.searchButton}
              name="archive-search"
              size={24}
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: Colors.PRIMARY,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 25,
    borderTopLeftRadius: 25,
    borderToptomRightRadius: 5,
  },
  userImage: {
    width: 45,
    height: 55,
    borderRadius: 50,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    padding: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    width: "85%",
    fontSize: 16,
    fontFamily: "outfit",
  },
  searchContainer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  searchButton: {
    backgroundColor: Colors.BEIGE,
    padding: 10,
    borderRadius: 10,
  },
});
