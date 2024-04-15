import React, { useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../Utils/Colors';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

const RecommendedStyleScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef(null);

    const handleSearchItemInHouse = () => {
        navigation.navigate("Search", { ref: searchInputRef })
    }

    const handlePress = () => {
        navigation.navigate("style")
    };

    const handleSearch = async () => {
        if (searchQuery === null || searchQuery === '') {
            Alert.alert("Empty String", "Item name can not be empty");
            return;
        }
    };

    const handleDislike = ()=>{

    }

    const handleLike = ()=>{
        
    }
    const renderSwipeableItem = (imageUrl, onLeftSwipe, onRightSwipe) => {
        return (
            <Swipeable
                renderRightActions={() => (
                    <TouchableOpacity style={[styles.swipeAction, { backgroundColor: "red" }]} onPress={onRightSwipe}>
                        <FontAwesome name='thumbs-down' size={24} color="white" />
                    </TouchableOpacity>
                )}
                renderLeftActions={() => (
                    <TouchableOpacity style={[styles.swipeAction, { backgroundColor: "green" }]} onPress={onLeftSwipe}>
                        <FontAwesome name='thumbs-up' size={24} color="white" />
                    </TouchableOpacity>
                )}
            >
                <View style={styles.swipeableItem}>
                    <Image source={{ uri: imageUrl }} style={styles.image}/>
                    <Text>This is recommended by Gemini</Text>
                </View>
            </Swipeable>
        );
    };
    
    

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={[styles.searchContainer]}>
                    <View style={{ paddingRight: 20 }}>
                        <TouchableOpacity onPress={handlePress}>
                            <FontAwesome name='plus' size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        placeholder="Search"
                        style={styles.textInput}
                        onChangeText={(text) => setSearchQuery(text)}
                        value={searchQuery}
                        onFocus={handleSearchItemInHouse}
                        onSubmitEditing={handleSearch}
                    />
                </View>
            </View>
            {/* Example of using swipe gestures */}
            {renderSwipeableItem("https://media.graphassets.com/tVxJfcPZSGyRp2aQixR7", handleLike, handleDislike)}
        </View>
    );
}

export default RecommendedStyleScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
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
        width: "85%",
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
    swipeableItem: {
        height:'100%',
        width:'100%'
    },
    swipeAction: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%', // Make the image take up the entire width of its container
        height: '100%', // Make the image take up the entire height of its container
        resizeMode: 'stretch', // Adjust the image resizeMode as needed
        borderRadius: 5,
        borderWidth: 1,
    },
});
