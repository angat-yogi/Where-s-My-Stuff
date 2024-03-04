import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import Heading from "../../Shared/Heading";

export default function Slider({ data, heading, isViewAll,plus, styleImage,displayHeading}) {
  const navigation = useNavigation();
  const handlePress = (action) => {
    if(action!=null){
      navigation.navigate(action); 
    }
    else{
      return;
    }
  };
  return (
    <View>
      <View style={styles.categories}>
        {
          displayHeading&&(  <Heading text={heading} isViewAll={isViewAll} />
          )
        }
        <View style={{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }}>

{plus && (
  <>
  <Heading text={heading} isViewAll={isViewAll} />
          <TouchableOpacity onPress={() => handlePress("Camera")}>
            <FontAwesome name="plus" size={24} color="black" />
          </TouchableOpacity>
  </>
            
        )}
        </View>
        
        <FlatList
          data={data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                handlePress('room')
              }
              style={{ marginRight: 20, alignItems: "center" }}
            >
              <Text style={styles.categoryName}>
                {item.name || item.storageTypeName}
              </Text>
              <Image
                style={styleImage}
                source={{
                  uri:
                    item?.displayImage?.url ||
                    item.image[0]?.url ||
                    item.image.url ||
                    null,
                }}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontFamily: "ProtestRiot",
    marginBottom: 10,
  },
  categories: {
    fontSize: 20,
    fontFamily: "ProtestRiot",
    marginBottom: 10,
  },
  categoryName: {
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
});
