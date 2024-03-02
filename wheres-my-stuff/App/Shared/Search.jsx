import React from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import Colors from '../Utils/Colors';

const Search =({searchText}) => {

    return (
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
    );
};

export default Search;

const styles = StyleSheet.create({
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
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        marginHorizontal:15,
        backgroundColor:Colors.PRIMARY
      },
      searchButton: {
        backgroundColor: Colors.BEIGE,
        padding: 10,
        borderRadius: 10,
      },
});

