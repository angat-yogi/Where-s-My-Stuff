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
export default function Header() {
  const { user, isLoading } = useUser();
  return (
    user && (
      <View style={styles.container}>
        <View style={styles.addContainer}>
          <View style={styles.profileContainer}>
            <TouchableOpacity>
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
                  fontFamily: "protestRiot",
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
          <TouchableOpacity>
            <MaterialIcons name="add-alert" size={29} color="black" />
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
              color={Colors.PRIMARY}
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
    fontFamily: "protestRiot",
  },
  searchContainer: {
    marginTop: 15,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  searchButton: {
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
  },
});
