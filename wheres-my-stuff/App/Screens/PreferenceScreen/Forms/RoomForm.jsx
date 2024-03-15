import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, Image, KeyboardAvoidingView, Modal, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import Colors from '../../../Utils/Colors';
import { SelectList } from 'react-native-dropdown-select-list';
import RoomType from '../../../Utils/Enums';
import ImageAPI from '../../../API/ImageAPI';
import { useUser } from '@clerk/clerk-expo';

const RoomForm = ({ isNewRoomAdditionLoading, image, selectedRoomType, setSelectedRoomType, isAddingNewRoom, setNewRoomName, setIsAddingNewRoom, handleAddRoom, newRoomName, setImage }) => {
    const { user, isLoading } = useUser();
    const [isFormComplete, setIsFormComplete] = useState(false);

    useEffect(() => {
        setIsFormComplete(newRoomName.trim() !== '' && image !== null && selectedRoomType !== null);
    }, [newRoomName, image, selectedRoomType]);

    const pickImages = async () => {
        setImage(null);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
            allowsEditing: true,
        });

        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePicture = async () => {
        setImage(null);
        try {
            let result = await ImagePicker.launchCameraAsync({
                cameraType: ImagePicker.CameraType.back,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });

            if (!result.cancelled) {
                setImage(result.assets[0].uri);
            }
            else {
                console.error("could not load image")
            }
        } catch (error) {
            Alert.alert('Error saving the picture: ' + error)
        }
    }

    const addButtonStyle = isFormComplete ? styles.addButton : [styles.addButton, styles.disabledButton];
    const disabledButtonStyle = {
        backgroundColor: '#ccc', // Grey background color
    };

    return (
        <View>
            <Modal visible={isAddingNewRoom} animationType="slide" transparent>
                <View style={styles.modalBackground}>
                    <KeyboardAvoidingView style={styles.modalContent} behavior="padding">
                        <Text style={styles.modalTitle}>Add New Room</Text>
                                {image ? (
                                    <Image source={{ uri: image }} style={styles.selectedImage} />
                                ) : (
                                    <View>
                                        <Text style={styles.imageRequiredText}>* Image is required</Text>
                                    </View>
                                )}        
                        <TextInput
                            style={styles.input}
                            placeholder="Enter room name"
                            value={newRoomName}
                            onChangeText={(text) => setNewRoomName(text)}
                        />
                        <View style={styles.selectListContainer}>
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
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-around", paddingBottom: 20 }}>
                            <TouchableOpacity onPress={takePicture}>
                                <EvilIcons name="camera" size={30} color={Colors.BEIGE} style={{ marginHorizontal: 10 }} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImages}>
                                <FontAwesome name="files-o" size={30} color={Colors.BEIGE} style={{ marginHorizontal: 10 }} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={isFormComplete ? addButtonStyle : [addButtonStyle, disabledButtonStyle]} onPress={handleAddRoom} disabled={!isFormComplete||isNewRoomAdditionLoading}>
                        {isNewRoomAdditionLoading ? ( // Render spinner if isNewRoomAdditionLoading is true
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.addButtonText}>Add Room</Text>
                            )}                        
                            </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsAddingNewRoom(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    );
};

export default RoomForm;

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
