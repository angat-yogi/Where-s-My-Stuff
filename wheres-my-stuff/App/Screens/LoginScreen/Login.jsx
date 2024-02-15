import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/warmUpBrowser";
import * as WebBrowser from "expo-web-browser";

import Colors from "../../Utils/Colors";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);
  return (
    <View style={{ alignItems: "center" }}>
      <Image
        source={require("../../../assets/images/login.png")}
        style={styles.imageContainer}
      />
      <View style={styles.subContainer}>
        <Text
          style={{
            fontSize: 27,
            color: Colors.WHITE,
            textAlign: "center",
            padding: 20,
          }}
        >
          Let's clean up our mess but first,
          <Text style={{ fontWeight: "bold" }}> Where's my stuff? </Text> I am
          tired!
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { marginRight: 5 }]}
            onPress={onPress}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 17,
                color: Colors.PRIMARY,
              }}
            >
              Let's find out
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text
              style={{
                textAlign: "center",
                fontSize: 17,
                color: Colors.PRIMARY,
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imageContainer: {
    width: 230,
    height: 450,
    marginTop: 20,
    borderWidth: 4,
    borderColor: Colors.BLACK,
    borderRadius: 15,
  },
  subContainer: {
    width: "100%",
    backgroundColor: Colors.PRIMARY,
    height: "70%",
    marginTop: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: "48%", // Adjust width as needed
    backgroundColor: Colors.WHITE,
    borderRadius: 99, // Example border radius, adjust as needed
    padding: 15, // Adjust padding as needed
    marginTop: 50,
  },
});
