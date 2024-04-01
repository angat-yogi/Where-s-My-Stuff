import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useRef, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Logo from "../../Shared/Logo";
import { useSharedState } from "../../State/SharedStateProvider";
import AmazonAPI from '../../API/AmazonAPI'
export default function Header({ style, shouldDisplayProfile, icon, action, displayName }) {
  const searchInputRef = useRef(null);
  const { user, isLoading } = useUser();
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const { sharedState, setSharedState } = useSharedState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [itemsToAddInHouse,setItemsToAddInHouse]=useState([]);

  const handleProfilePress = () => {
    navigation.openDrawer();
  };

  const handlePress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleProductPress =(item)=>{
    setItemsToAddInHouse([...itemsToAddInHouse,{imageUri:item.imageUri,productId:item.productId,name:item.name}])
    console.log("item added",itemsToAddInHouse)

  }
  const handleSearch = async () => {
    if(searchQuery===null||searchQuery===''){
      Alert.alert("Empty String","Item name can not be empty")
      return;
    }
    setIsSearchLoading(true);
    console.log("searching",searchQuery)
    //first search in the database and ask if they just bought it from Amazon
    //if they just bought itm they should be able to add it to their pending items which 
    //they should be able to add in rooms later
    const data = await AmazonAPI.fetchAmazonData(searchQuery);
    const formattedResults = data.searchProductDetails.map((item) => ({
      productId: item.asin,
      imageUri: item.imgUrl,
      name: item.productDescription,
    }));
    setSearchResults(formattedResults);
    setIsSearchModalVisible(true)
    setIsSearchLoading(false);
    setSearchQuery("")

  };

  const closeSearchModal=()=>{
    setIsSearchModalVisible(false)
    setSearchQuery(""); // Reset search query to empty string

  }
  const addToPendingUserItems=()=>{
    setSharedState(prevState => ({
      ...prevState,
      pendingItems: itemsToAddInHouse // Assuming the API response contains the updated data
  }));
    setIsSearchModalVisible(false)
    setSearchQuery(""); // Reset search query to empty string
Alert.alert("Success!","You can now add the items to desired location")
  }
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
          <TextInput
            placeholder="Search"
            style={styles.textInput}
            onChangeText={(text) => setSearchQuery(text)}
            value={searchQuery}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            {isSearchLoading ? (
              <ActivityIndicator size="small" color={Colors.WHITE} />
            ) : (
              <MaterialCommunityIcons
                name="archive-search"
                size={24}
                color={Colors.WHITE}
              />
            )}
          </TouchableOpacity>
          <Modal visible={isSearchModalVisible} animationType="slide" onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={{alignItems:'center',paddingBottom:10}}>
              <Text style={{fontSize:15,fontWeight:'bold'}}>Please add items in your repository</Text>
              </View>
              <View style={[styles.resultsContainer, { maxHeight: Dimensions.get('window').height * 0.7 }]}>
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }) => (
                  <View style={styles.itemContainer}>
                    <Image source={{ uri: item.imageUri }} style={[styles.itemImage, {resizeMode: 'contain'}]} />
                    <Text style={styles.itemName}>{item.name.toString().substring(0,30)+'...'}</Text>
                    <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.button}>
                      <Text style={styles.buttonText}>Add to my Items</Text>
                    </TouchableOpacity>
                  </View>
                )}
                numColumns={2} // Set to 2 to display two products per row
                showsVerticalScrollIndicator={false}
              />
              </View>
              <View style={{paddingTop:10,flexDirection:'row',justifyContent:'center'}}>
              <TouchableOpacity onPress={closeSearchModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addToPendingUserItems} style={styles.addPendingButton}>
                <Text style={styles.closeButtonText}>Done</Text>
              </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </Modal>
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
    )
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 20,
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
    width: "95%", // Adjust the width as needed
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
  loadingIndicator: {
    marginTop: 20,
  },
  resultsContainer: {
    paddingLeft:10,
  },
  itemContainer: {
    width: '48%', // Adjusted to occupy 100% width
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    flexDirection: 'column', // Changed to column layout
  marginRight: 10,
  },
  
  itemImage: {
    width: '100%', // Image width set to occupy full width of container
    height: 150, // Adjust height as needed
    marginBottom: 10, // Added margin at bottom of image
    borderRadius: 5,
  },
  
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10, // Added margin at bottom of name
  },
  
  buttonContainer: {
    marginTop: 'auto', // Aligns button to the bottom
  },
  
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  closeButton: {
    alignSelf: 'center', 
    padding: 10,
    backgroundColor:Colors.BEIGE,
    borderRadius:5, 
    marginRight:10
  },
  addPendingButton:{
    alignSelf: 'center', 
    padding: 10,
    backgroundColor:"green",
    borderRadius:5, 
  },
  closeButtonText: {
    color: 'white', // You can change the color to your preference
    fontSize: 16,
  },
});
