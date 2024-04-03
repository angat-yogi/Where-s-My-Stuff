import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Image, KeyboardAvoidingView, Modal, Text, TextInput, TouchableOpacity, View, Platform } from 'react-native';
import { StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import Colors from '../../../Utils/Colors';
import { useUser } from '@clerk/clerk-expo';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';


import { Camera } from 'expo-camera';
import ImageAPI from '../../../API/ImageAPI';


const ItemForm = ({ isNewItemAdditionLoading,furnitureType, image, isAddingNewItem, setNewItemName, setIsAddingNewItem, handleAddItem, newItemName, setImage,brandName, setBrandName,newItemSize,setNewItemSize,isEdit,setIsEdit,editItem}) => {
    const { user, isLoading } = useUser();
    const [isFormComplete, setIsFormComplete] = useState(false);
    const ALBUM_NAME = 'WMS';
    const [isImageLoading,setIsImageLoading]=useState(null)

    const requestPermissions = async () => {
        // Request media library permission
        const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
        if (mediaLibraryPermission.status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to the media library');
            return;
        }

        // Request camera permission
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        if (cameraPermission.status !== 'granted') {
            Alert.alert('Permission required', 'Please allow access to the camera');
            return;
        }
    };

    useEffect(() => {
        setIsFormComplete(newItemName.trim() !== '' && image !== '' && furnitureType !== '');
    }, [newItemName, image, furnitureType]);


    useEffect(()=>{
        requestPermissions();
        if (isEdit && editItem) {
            setNewItemName(editItem.name || '');
            setBrandName(editItem.brand || '');
            setNewItemSize(editItem.size || '');
            setImage({ uri: editItem.image || '', id: editItem.id || '' });
        }
    },[editItem,isEdit])
    const generateRandomString = () => {
        return Math.random().toString(36).substring(7);
    }

    const handleImageSelection = async (result) => {
        if (!result.cancelled) {
            const formData = new FormData();
            formData.append("file", {
                uri: result.assets[0].uri,
                type: "image/jpeg",
                name: "item-image",
            });
            try {
                setIsImageLoading(true)
                const blob = await ImageAPI.getFormattedImage(formData);
    
                if (!blob) {
                    setIsImageLoading(false)
                    throw new Error('Response is not a blob');
                }
                const url = URL.createObjectURL(blob);
    
                setImage({ uri: url, id: '' });
                setIsImageLoading(false)
    
                // Create a temporary file path to save the image
                const temporaryDirectory = FileSystem.documentDirectory + 'temp/';
                await FileSystem.makeDirectoryAsync(temporaryDirectory, { intermediates: true });
                const temporaryFilePath = temporaryDirectory + `processed_image_${generateRandomString()}.png`;
    
                const base64Data = await blobToBase64(blob);
    
                // Write the image Blob to the temporary file
                await FileSystem.writeAsStringAsync(temporaryFilePath, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });
    
                let album = await MediaLibrary.getAlbumAsync(ALBUM_NAME);
                if (album === null) {
                    album = await MediaLibrary.createAlbumAsync(ALBUM_NAME);
                }
    
                // Save the image to the WMS album
                const asset = await MediaLibrary.createAssetAsync(temporaryFilePath);
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        
                const assets = await MediaLibrary.getAssetsAsync({ album: album, sortBy: ['creationTime'], sortOrder: 'desc' });
    
                if (assets.assets.length > 0) {
                    // Set the URI of the most recent asset as the image URI
                    setImage({ uri: assets.assets[0].uri, id: assets.assets[0].id });
                }    
            } catch (error) {
                // Handle errors
                console.error(error);
            }
    
        } else {
            console.error("could not load image")
        }
    }
    
    const pickImages = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4, 3],
                quality: 1,
                allowsEditing: true,
            });
    
            await handleImageSelection(result);
    
        } catch (error) {
            Alert.alert('Error saving the picture: ' + error)
        }
    }
    
    const takePicture = async () => {
        try {
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                exif: false
            });
    
            await handleImageSelection(result);
    
        } catch (error) {
            Alert.alert('Error saving the picture: ' + error)
        }
    }
    

    const blobToBase64 = async (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve(base64Data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      const close =() => {
        setIsAddingNewItem(false) 
        setIsEdit(false)
        setNewItemName('');
        setBrandName('');
        setNewItemSize('');
        setImage({ uri: '', id: '' });
    }

    const addButtonStyle = isFormComplete && isImageLoading===false ? styles.addButton : [styles.addButton, styles.disabledButton];
    const disabledButtonStyle = {
        backgroundColor: '#ccc', // Grey background color
    };
    

    return (
        <View>
            <Modal visible={isAddingNewItem||isEdit} animationType="slide" transparent>
                <View style={styles.modalBackground}>
                    <KeyboardAvoidingView style={styles.modalContent} behavior="padding">
                        <Text style={styles.modalTitle}>{!isEdit?'Add new Item':'Edit Item'}</Text>
                        {
                            isImageLoading ? (
                                <ActivityIndicator size="large" color="black" />
                            ) : (
                                image.uri ? (
                                    <Image source={{ uri: image.uri }} style={styles.selectedImage} />
                                ) : (
                                    <View>
                                        <Text style={styles.imageRequiredText}>* Image is required</Text>
                                    </View>
                                )
                            )
                        }
                        <TextInput
                            style={styles.input}
                            placeholder="Enter item name"
                            value={newItemName}
                            onChangeText={(text) => setNewItemName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter brand name"
                            value={brandName}
                            onChangeText={(text) => setBrandName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter size"
                            value={String(newItemSize)}
                            onChangeText={(text) => setNewItemSize(text)}
                        />
                        {/* <View style={styles.selectListContainer}>
                            <SelectList
                                setSelected={(val) => setSelectedRoomType(val)}
                                containerStyle={styles.selectList}
                                textStyle={styles.selectListText}
                                itemStyle={styles.selectListItem}
                                selectedItemStyle={styles.selectListItemSelected}
                                data={Object.values(RoomType)} // Pass array of enum values to SelectList
                                save="value"
                                placeholder="Select Room Type"
                                defaultOption="Other"
                                search={false}
                            />
                        </View> */}

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingBottom: 20 }}>
                            <TouchableOpacity onPress={takePicture}>
                                <EvilIcons name="camera" size={30} color={Colors.BEIGE} style={{ marginHorizontal: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImages}>
                                <FontAwesome name="files-o" size={30} color={Colors.BEIGE} style={{ marginHorizontal: 10 }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={isFormComplete&& isImageLoading===false ? addButtonStyle : [addButtonStyle, disabledButtonStyle]} onPress={handleAddItem} disabled={!isFormComplete||isNewItemAdditionLoading|| !isImageLoading===false}>
                        {isNewItemAdditionLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={styles.addButtonText}>
                                {isEdit ? 'Save Changes' : `Add ${newItemName ? `${newItemName} to ${furnitureType}` : 'Item'}`}
                            </Text>
                            )}
                            </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButton} onPress={close}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
};

export default ItemForm;

const styles = StyleSheet.create({
    selectListContainer: {
        width: '80%',
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingVertical: 8,
    },
    selectList: {
        width: '80%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingBottom: 10,
        paddingVertical: 8,
    },
    selectListText: {
        fontSize: 16,
    },
    selectListItem: {
        paddingVertical: 8,
    },
    selectListItemSelected: {
        backgroundColor: 'red',
    },
    roomName: {
        fontSize: 16,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent black background
    },
    modalContent: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // slightly transparent white
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        width: '80%',
        marginBottom: 20,
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
        marginBottom: 10
    },
    closeButtonText: {
        color: 'white',
        fontSize: 18,
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
});
