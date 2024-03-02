import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Colors from '../../../Utils/Colors';

const ClothForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri } = route.params;

  const [brandName, setBrandName] = useState('');
  const [size, setSize] = useState('');

  const handleCancel = () => {
    navigation.navigate('closet');
  };

  const handleSubmit = () => {
    console.log('Brand Name:', brandName);
    console.log('Size:', size);

    // Implement submit logic here
    Alert.alert('Submitted', 'Thankn you!', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
};

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUri }} style={styles.image} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Brand Name"
        value={brandName}
        onChangeText={setBrandName}
      />
      <TextInput
        style={styles.input}
        placeholder="Size"
        value={size}
        onChangeText={setSize}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: "mediumseagreen" }]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: "tomato" }]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  input: {
    width: '80%',
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.GRAY,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
  },
});

export default ClothForm;
