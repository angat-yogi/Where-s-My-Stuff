import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../Shared/Logo";

export default function Header({ style, shouldDisplayProfile, icon, action, displayName }) {
  const { user, isLoading } = useUser();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleProfilePress = () => {
    navigation.openDrawer();
  };

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsModalVisible(false); // Close the modal after selecting an option
    // Perform any action based on the selected option
    // For example, you can navigate to a different screen or execute specific logic
    switch (option) {
      case "furniture":
        // Handle furniture option
        break;
      case "rooms":
        // Handle rooms option
        break;
      case "items":
        // Handle items option
        break;
      default:
        break;
    }
  };

  return (
    user && (
      <View style={styles.container}>
        <View style={styles.addContainer}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleProfilePress}>
              <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
            </TouchableOpacity>
            {displayName && (
              <View>
                <Text style={{ fontSize: 13, color: "purple", fontFamily: "outfit" }}>
                  Hello,{" "}
                </Text>
                <Text style={{ fontSize: 15, color: Colors.BLACK, fontFamily: "outfit-bold" }}>
                  {user?.firstName}!
                </Text>
              </View>
            )}
            <View style={styles.logo}>
              <Logo />
            </View>
          </View>
          <TouchableOpacity onPress={handlePress}>
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

        {/* Modal for the action */}
        <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.questionText}>What would you like to add?</Text>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect("rooms")}>
              <Text style={styles.optionText}>Rooms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect("furniture")}>
              <Text style={styles.optionText}>Furniture</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleOptionSelect("items")}>
              <Text style={styles.optionText}>Items</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.optionButton, styles.cancelButton]} onPress={closeModal}>
              <Text style={styles.optionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
    borderTopRightRadius: 5,
  },
  userImage: {
    width: 45,
    height: 60, // Decreased height to make it fit better
    borderRadius: 50,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addContainer: {
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  searchButton: {
    backgroundColor: Colors.BEIGE,
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    // No need to specify flex and alignContent for proper alignment
    margin:18
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%", // Adjust the width as needed
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#DDDDDD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "red", // Change cancel button color
  },
});
