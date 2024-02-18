import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { Feather } from "@expo/vector-icons";

export default function Heading({ text, isViewAll = false }) {
  return (
    <View style={styles.container}>
      {text === "Trending Fashions" ? (
        <Text style={styles.heading}>
          <Feather name="trending-up" size={30} color="green" /> {"  "}
          {text}
        </Text>
      ) : (
        <Text style={styles.heading}>{text}</Text>
      )}
      {isViewAll ? (
        <TouchableOpacity>
          <Text style={{ fontWeight: "bold", fontSize: 10 }}>
            <Feather name="more-horizontal" size={24} color="black" />
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 20,
    fontFamily: "ProtestRiot",
    marginBottom: 10,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
