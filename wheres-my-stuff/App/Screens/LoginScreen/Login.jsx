import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/warmUpBrowser";
import * as WebBrowser from "expo-web-browser";
const { width,height } = Dimensions.get('window');

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
    <View style={{ flex:1,flexDirection:'column',height:height,width:width }}>
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
    alignSelf: 'center', // Center the image horizontally
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingTop: 20, // Padding from the top instead of marginTop
    paddingHorizontal: 20, // Padding horizontally
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
    paddingBottom:29 // Center items vertically
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Evenly distribute buttons
    width: "100%",
    marginTop: 20, // Add some margin from the previous text
  },
  button: {
    backgroundColor: Colors.WHITE,
    borderRadius: 99, // Example border radius, adjust as needed
    paddingVertical: 15, // Adjust padding as needed
    paddingHorizontal: 20, // Adjust padding as needed
    alignItems: 'center', // Center text horizontally
  },
});

