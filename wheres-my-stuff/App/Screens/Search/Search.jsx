import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AmazonAPI from '../../API/AmazonAPI'
import Colors from '../../Utils/Colors';
import { useSharedState } from '../../State/SharedStateProvider';

const Search = ({ typeOfSearch, setItemsToAddInHouse, itemsToAddInHouse, isSearchModalVisible, setIsSearchModalVisible }) => {
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const { sharedState, setSharedState } = useSharedState();
    const [modalHeight, setModalHeight] = useState('80%'); // State for dynamic modal height

    useEffect(() => {
        setModalHeight(searchResults.length > 0 ? '80%' : null);

      }, [searchResults]);

    const handleSearch = async () => {
        if (searchQuery === null || searchQuery === '') {
            Alert.alert("Empty String", "Item name cannot be empty");
            return;
        }
        setIsSearchLoading(true);
        let formattedResults=[];
        if (typeOfSearch === 'items') {
            const data = await AmazonAPI.fetchAmazonData(searchQuery);

             formattedResults = data.searchProductDetails.map((item) => ({
                productId: item.asin,
                imageUri: item.imgUrl,
                name: item.productDescription,
            }));
            
        }
        setSearchResults(formattedResults);
        setIsSearchModalVisible(true);
        setIsSearchLoading(false);
        setSearchQuery("")
    };

    const handleProductPress = (item) => {
        setItemsToAddInHouse([...itemsToAddInHouse, { imageUri: item.imageUri, productId: item.productId, name: item.name }]);
    }

    const closeSearchModal = () => {
        setIsSearchModalVisible(false);
        setSearchQuery("");
        setSearchResults([]);
    }

    const addToPendingUserItems = () => {
        setSharedState(prevState => ({
            ...prevState,
            pendingItems: itemsToAddInHouse
        }));
        setIsSearchModalVisible(false);
        setSearchQuery("");
        Alert.alert("Success!", "You can now add the items to desired location");
    }

    return (
        <Modal visible={isSearchModalVisible} animationType="slide" onRequestClose={() => setIsSearchModalVisible(false)}>
        <View style={styles.modalBackground}>
            <View style={[styles.modalContent, { height: modalHeight }]}>
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
                </View>
                {
                searchResults.length === 0 ? ( // Conditionally render message when no items found
                    <Text style={styles.noItemsText}>No items found. Try searching differently.</Text>
                ) : (
                    <View style={styles.resultsContainer}>
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
                )}
                <View style={styles.buttonContainer}>
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
    );
};

export default Search;

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
    },
    modalContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // slightly transparent white
        width: '90%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center', // Center content vertically
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
        marginBottom: 15
    },
    searchButton: {
        backgroundColor: Colors.BEIGE,
        padding: 10,
        marginLeft: 10,
        borderRadius: 10,
    },
    resultsContainer: {
        flex: 1,
        marginBottom: 10,
    },
    itemContainer: {
        width: '48%',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        flexDirection: 'column',
        marginRight: 10,
        alignItems: 'center', // Center items horizontally
    },
    itemImage: {
        width: '100%',
        height: 150,
        marginBottom: 10,
        borderRadius: 5,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center', // Center text horizontally
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10, // Adjust vertical margin
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: Colors.BEIGE,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    addPendingButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
    noItemsText: {
        textAlign: 'center', // Center text horizontally
        marginTop: 20, // Adjust top margin
        fontSize: 16,
    },
});
