import React, { useState } from 'react';
import { View, Image, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Camera } from 'expo-camera';

const BackgroundAdjustmentScreen = ({imageUri}) => {
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

  // Function to handle background adjustment
  const handleBackgroundAdjustment = (value) => {
    setBackgroundOpacity(value);
    // Apply background adjustment to the image
    // Update the imageUri state with the adjusted image
  };

  return (
    <View style={{ flex: 0.1 }}>
    <ScrollView style={{ flex: 1 }}>
      {imageUri && typeof imageUri !== 'string' ? ( // Check if imageUri is defined and not a string
        imageUri.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={{ width: '100%', height: 300 }}
            resizeMode="contain"
          />
        ))
      ) : (
        <Image
          source={{ uri: imageUri }}
          style={{ width: '100%', height: 300 }}
          resizeMode="contain"
        />
      )}
    </ScrollView>
    <Slider
      style={{ width: '100%', height: 40 }}
      minimumValue={0}
      maximumValue={1}
      value={backgroundOpacity}
      onValueChange={handleBackgroundAdjustment}
      minimumTrackTintColor="#FFFFFF"
      maximumTrackTintColor="#000000"
    />
  </View>
  );
};

export default BackgroundAdjustmentScreen;
