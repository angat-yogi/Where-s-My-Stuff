import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../Shared/Logo";
import Search from "../Search/Search";
export default function Header({ shouldDisplayProfile, icon, displayName, shouldDisplayBack }) {
  const { user } = useUser();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [itemsToAddInHouse,setItemsToAddInHouse]=useState([]);
  const searchInputRef = useRef(null);

useEffect(() => {
  if (shouldDisplayBack) {
    searchInputRef.current.focus();
  }
}, [shouldDisplayBack]);

  const handleSearchItemInHouse = ()=>{
    navigation.navigate("Search",{ ref:searchInputRef })
    
  }
  const handleProfilePress = () => {
    navigation.openDrawer();
  };

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleSearch = async () => {
    if(searchQuery === null || searchQuery === ''){
      Alert.alert("Empty String","Item name can not be empty");
      return;
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    switch (option) {
      case "furniture":
        // Handle furniture option
        break;
      case "rooms":
        navigation.navigate("Preference")
        break;
      case "items":
        // Handle items option
        break;
      default:
        break;
    }
    setIsModalVisible(false);
    setIsSearchModalVisible(true);
  };


  return (
    user && (
      <>
        <View style={styles.container}>
          <View style={styles.addContainer}>
           
          {shouldDisplayProfile?
          (<View style={styles.profileContainer}>
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
          </View>):(<></>)
          }
          {icon?(<TouchableOpacity onPress={handlePress}>
              <FontAwesome name={icon} size={24} color="black" />
            </TouchableOpacity>):(<></>)}
          </View>
          <View  style={[styles.searchContainer]}>
          {/* {shouldDisplayBack?
             (
             <View style={{marginRight:10}}>
             <TouchableOpacity onPress={handleTrendingSearches}> 
             <Ionicons name="arrow-back-circle-sharp" size={35} color={Colors.BEIGE} />
         </TouchableOpacity>
         </View>
         ):(<></>)
            } */}
            <TextInput
              placeholder="Search"
              style={styles.textInput}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              onFocus={handleSearchItemInHouse}
              onSubmitEditing={handleSearch} 
            />
            
          </View>
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
          {selectedOption === 'items' && (
            <Search
              typeOfSearch={selectedOption} 
              setItemsToAddInHouse={setItemsToAddInHouse}
              itemsToAddInHouse={itemsToAddInHouse}
              isSearchModalVisible={isSearchModalVisible}
              setIsSearchModalVisible={setIsSearchModalVisible}
            />
          )}
      </>
    )
  );
}

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    flexDirection: 'column',
  },
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
    height: 60,
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
     width:  "85%",
    fontSize: 16,
    fontFamily: "outfit",
  },
  searchContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center", // Center the content vertically

  },
  searchButton: {
    backgroundColor: Colors.BEIGE,
    padding: 10,
    borderRadius: 10,
  },
  logo: {
    margin:18
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "95%",
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
    backgroundColor: "red",
  },
});
