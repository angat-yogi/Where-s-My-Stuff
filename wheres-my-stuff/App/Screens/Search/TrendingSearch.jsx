import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../Utils/Colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import Header from "../HomeScreen/Header";

const TrendingSearch = () => {
    const navigation = useNavigation();
   
  return (
    <>
    <Header shouldDisplayBack={true} shouldDisplayProfile={false}/>
    <View style={styles.container}>
    
      <Text style={styles.heading}>Trending Searches</Text>
      {/* Add your trending searches here */}
      <Text style={styles.searchText}>Trending Search 1</Text>
      <Text style={styles.searchText}>Trending Search 2</Text>
      <Text style={styles.searchText}>Trending Search 3</Text>
      {/* End of trending searches */}
    </View>
    </>
    
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default TrendingSearch;
