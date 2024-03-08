import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Image, Text, Dimensions, Alert } from 'react-native';
import { EvilIcons, FontAwesome } from '@expo/vector-icons'; // Import icons from Expo
import * as ImagePicker from "expo-image-picker";

const ImageOrCamera = ({ isVisible, displayCamera, displayImagePicker, imageUri, setImageUri, setOpenCameraModal }) => {

    const takePicture = async () => {
        try {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
                alert('Camera permission is required to take a picture.');
                return;
            }
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });
            if (!result.cancelled) {
                setImageUri(result.assets[0].uri);

            }
            else {
                console.log("could not load image")
            }
        } catch (error) {
            Alert.alert('Error saving the picture: ' + error)
        }
    }

    const handleAddImage =()=>{

        if(imageUri!==null){
            setOpenCameraModal(false)
        }
    }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImageUri(result.assets[0].uri);

        }
    };
    const addButtonStyle = imageUri!=null ? styles.addButton : [styles.addButton, styles.disabledButton];
      const disabledButtonStyle = {
        backgroundColor: '#ccc', // Grey background color
    };


    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <Modal
            isVisible={isVisible}
            animationType="fade"
            transparent
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Image of Furniture</Text>
    
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.selectedImage} />
                    ) : (
                        <View>
                            <Text style={styles.imageRequiredText}>* Image is required</Text>
                        </View>
                    )}
                    <View style={styles.buttonContainer}>
                        {displayCamera&&<TouchableOpacity onPress={takePicture}>
                            <EvilIcons name="camera" size={30} color="black" style={styles.iconStyle} />
                        </TouchableOpacity>}
                        {displayImagePicker&&<TouchableOpacity onPress={pickImage}>
                            <FontAwesome name="files-o" size={30} color="black" style={styles.iconStyle} />
                        </TouchableOpacity>}
                    </View>
                    <TouchableOpacity style={imageUri ? addButtonStyle : [addButtonStyle, disabledButtonStyle]} onPress={handleAddImage} disabled={!imageUri}>
                        <Text style={styles.addButtonText}>Add Image</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.closeButton} onPress={() => setOpenCameraModal(false)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Blue background with some opacity
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        alignContent:'center',
        marginBottom: 10,
    },
    iconStyle: {
        marginHorizontal: 10,
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    disabledButton: {
        opacity: 0.5, // Reduced opacity for a disabled look
    },
    addButton: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
    },
    closeButton: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom:10
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
    },
});

export default ImageOrCamera;
