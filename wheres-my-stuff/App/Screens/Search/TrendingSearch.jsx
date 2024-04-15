import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, FlatList, Image, ActivityIndicator } from "react-native";
import Colors from "../../Utils/Colors";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import Header from "../HomeScreen/Header";
import GlobalApi from '../../API/GlobalApi';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "@clerk/clerk-expo";
import MarqueeView from '@aitfakirali/react-native-marquee';
import * as SecureStore from 'expo-secure-store'
const TrendingSearch = ({seachInputRef}) => {
    const navigation = useNavigation();
    const { user, isLoading } = useUser();
    const [isItemSearchLoading,setIsItemSearchLoading]=useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredItems, setFilteredItems] = useState([]);
    const searchInputRef = useRef(null);
    const marqueeRef = useRef(null)
    const placeholders = ['Search', 'Brush', 'Laptop by Dell', 'Black Top','Blue Jeans'];
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [searchPressed,setSearchPressed]=useState(false)
    const [items,setItems]=useState([])
    const [key, onChangeKey]=useState('')
    const [value, onChangeValue]=useState('')
    const [searchHistory, setSearchHistory] = useState([]);


    const save = async (key,value)=>{
        await SecureStore.setItemAsync(key,value);
    }

    const getValueFor=async (key)=>{
        let result=await SecureStore.getItemAsync(key);
        if(result){

        }
    }
    useEffect(() => {
        // Focus on the search input when the component mounts
        searchInputRef.current.focus();
        fetchItems();
        loadSearchHistory();

        // Change the placeholder text every 3 seconds
        const interval = setInterval(() => {
            setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
        }, 1000);

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);
    const handleSearchItemInHouse = () => {        // Clear filtered items when focusing on the input

        setFilteredItems([]);
        setSearchPressed(false); // Reset searchPressed to false
    };

      const fetchItems = async () => {
        try {
            setIsItemSearchLoading(true); // Start loading
            const response = await GlobalApi.GetAllUserFurnitureItems({ email: user.emailAddresses[0].emailAddress });
            setItems(response.furnitureItems);
            setIsItemSearchLoading(false); // Stop loading

        } catch (error) {
            setIsItemSearchLoading(false); // Stop loading on error
            console.error('Error fetching items:', error);
        }
    };

    const updateSearchHistory = async (query) => {
        try {
            let history = [...searchHistory];
            // Check if the query already exists in the history
            const index = history.findIndex((item) => item.toLowerCase() === query.toLowerCase());
            if (index === -1) {
                // If not found, add the query to the history
                history = [...history, query];
            } else {
                // If found, move the existing query to the end of the history array
                const existingQuery = history.splice(index, 1);
                history.push(existingQuery[0]);
            }
            // Save the updated history
            await SecureStore.setItemAsync('searchHistory', JSON.stringify(history));
            setSearchHistory(history);
        } catch (error) {
            console.error('Error updating search history:', error);
        }
    };

    const loadSearchHistory = async () => {
        try {
            const history = await SecureStore.getItemAsync('searchHistory');
            if (history !== null) {
                setSearchHistory(JSON.parse(history));
            }
        } catch (error) {
            console.error('Error loading search history:', error);
        }
    };

    const handleTrendingSearches = () => {
        // Navigate to trending searches page with initialParams
        setTimeout(() => {
        navigation.navigate("home", { initialParams: { refresh: true } });
        },300);
    };
    
    const handleSearch = async () => {
        fetchItems();
        if(searchQuery === null || searchQuery === ''){
          Alert.alert("Empty Search","Search name can not be empty");
          return;
        }
        else{

            // Split the search query into individual words
            const searchWords = searchQuery.toLowerCase().split(' ');
    
            // Filter items that match any of the words in the search query
            const filtered = items.filter((item) => {
                // Check if any of the words in the search query match the item's name or room
                return searchWords.some((word) =>
                    item.name.toLowerCase().includes(word) ||
                    item.room.toLowerCase().includes(word) ||
                    item.furniture.toLowerCase().includes(word)
                );
            });
    
            setFilteredItems(filtered.slice(0, 10)); // Limit to 10 items
            setSearchPressed(true);
            updateSearchHistory(searchQuery);

        }
    };

    const handleHistoryItemClick = (query) => {
        setSearchQuery(query);
        setSearchPressed(true);
    };
    useEffect(() => {
        if (searchQuery !== '' && searchPressed) {
            handleSearch();
        }
    }, [searchQuery]);
    const renderItemHistory = ({ item, index }) => (
        <View style={styles.historyItemContainer}>
            <View style={styles.historyItemContainer}>
            <MaterialIcons name="history" size={24} color="black" />
            <TouchableOpacity onPress={() => handleHistoryItemClick(item)}>
            <Text style={styles.historyItem}> {item}</Text>
            </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => handleRemoveHistoryItem(index)}>
                <Ionicons name="close-circle" size={20} color={Colors.BEIGE} />
            </TouchableOpacity>
        </View>
    );

    
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemClick(item)}>
            <View style={styles.item}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.itemDetails}>
                    <MarqueeView ref={marqueeRef} speed={0.2} style={styles.itemDetails}>
                        <View>
                            <Text style={styles.itemName}>{item.furniture}</Text>
                            <Text style={styles.itemDescription}>in</Text>
                            <Text style={styles.itemName}>{item.room} </Text>
                            <Text style={styles.itemDescription}>is in</Text>
                            <Text style={styles.itemName}> {item.name}</Text>
                        </View>
                    </MarqueeView>
                </View>
            </View>
        </TouchableOpacity>
        
    );
    
    const handleRemoveHistoryItem = async (index) => {
        try {
            const updatedHistory = [...searchHistory];
            updatedHistory.splice(index, 1);
            await SecureStore.setItemAsync('searchHistory', JSON.stringify(updatedHistory));
            setSearchHistory(updatedHistory);
        } catch (error) {
            console.error('Error removing history item:', error);
        }
    };

    const handleItemClick = (item) => {
        if (item) {
            navigation.navigate('furniture', { selectedItem: {email:user.emailAddresses[0].emailAddress,image:item.image,name:item.furniture}, room: item.room, selectedItemId: item.id});
        } else {
            return;
        }
    };


  return (
    <>
        <View style={styles.container}>
          <View  style={[styles.searchContainer]}>

             <View style={{marginRight:10}}>
             <TouchableOpacity onPress={handleTrendingSearches}> 
             <Ionicons name="arrow-back-circle-sharp" size={35} color={Colors.BEIGE} />
         </TouchableOpacity>
         </View>

            <TextInput
              ref={searchInputRef}
              placeholder={placeholders[placeholderIndex]} // Dynamic placeholder text
              style={styles.textInput}
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
              onFocus={handleSearchItemInHouse}
              onSubmitEditing={handleSearch} 
              returnKeyType="search" // Set returnKeyType conditionally
              />
          </View>
        </View>
        {isItemSearchLoading && (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
    )}
     <View style={styles.resultContainer}>
     {searchQuery !== '' && filteredItems.length === 0 &&searchPressed && (
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                No item found matching search '{searchQuery}'
            </Text>
        )}
        {filteredItems.length > 0 && (
            <FlatList
                data={filteredItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
            />
        )}
    </View>
{searchHistory.length>0 && filteredItems.length ===0&&  
(<View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Recent Searches</Text>
                <FlatList
                    data={searchHistory}
                    renderItem={renderItemHistory}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.historyList}
                />
    </View>)
}

    </>
    
  );
};

const styles = StyleSheet.create({
  lowerContainer: {
    backgroundColor: Colors.WHITE,
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.BLACK,
  },
  searchText: {
    fontSize: 16,
    marginBottom: 5,
    color: Colors.GRAY,
  },
  resultContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
},
list: {
    flexGrow: 1,
},
item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth:0.2,
    borderRadius:5
},
itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
},
itemName: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
},
itemDescription: {
    marginRight: 5,
    fontSize: 16,
    color: Colors.GRAY,
},
itemRoom: {
    fontSize: 16,
    color: Colors.BLACK,
},
image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderWidth:0.5,
    borderRadius:3
},
historyContainer: {
    paddingLeft:10
},
historyTitle: {
    fontSize: 18,
    marginBottom: 10,
    textAlign:'center'
},
historyList: {
    paddingHorizontal: 20,
},
historyItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
},
historyItem: {
    fontSize: 16,
    color: "black",
},
});

export default TrendingSearch;
