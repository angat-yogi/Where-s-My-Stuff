import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, TextInput, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
const RoomModal = ({ modalVisible, data, onNext, setModalVisible, onClose }) => {
    const [furnitures, setFurnitures] = useState([
        { id: 1, name: 'Closet' },
        { id: 2, name: 'Table' },
        { id: 3, name: 'Drawer' },
        { id: 4, name: 'Second Table' },
        { id: 5, name: 'Bed' },
    ]);
    const [selectedFurnitures, setSelectedFurnitures] = useState([]);
    const [showAddFurnitureForm, setShowAddFurnitureForm] = useState(false);
    const [newFurnitureName, setNewFurnitureName] = useState('');

    const handleCloseModal = () => {
        setModalVisible(false); // Call setModalVisible to close the modal
    };

    const toggleFurnitureSelection = (furniture) => {
        const isSelected = selectedFurnitures.some((item) => item.id === furniture.id);
        if (isSelected) {
            setSelectedFurnitures(selectedFurnitures.filter((item) => item.id !== furniture.id));
        } else {
            setSelectedFurnitures([...selectedFurnitures, furniture]);
        }
    };

    const handleAddFurniture = () => {
        setShowAddFurnitureForm(true);
    };

    const handleSubmitNewFurniture = () => {
        // Add the new furniture to the list
        const newFurniture = { id: furnitures.length + 1, name: newFurnitureName };
        setFurnitures([...furnitures, newFurniture]);
        // Reset the form and hide it
        setNewFurnitureName('');
        setShowAddFurnitureForm(false);
    };

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <KeyboardAvoidingView style={[styles.modalContent, { width: windowWidth * 0.9, height: windowHeight * 0.8 }]} behavior="padding">
                    <Text style={styles.modalTitle}>{data.name}</Text>
                    {data.imageUri && <Image source={{ uri: data.imageUri }} style={styles.selectedImage} />}
                    <Text style={styles.modalDescription}>This is where you can customize your living room storage options.</Text>
                    <ScrollView horizontal={true}  showsHorizontalScrollIndicator={false} contentContainerStyle={styles.furnitureOptionsContainer}>
                        {furnitures.map((furniture) => (
                            <TouchableOpacity key={furniture.id} onPress={() => toggleFurnitureSelection(furniture)}>
                                <View style={[styles.furnitureOption, selectedFurnitures.some((item) => item.id === furniture.id) && styles.selectedFurnitureOption]}>
                                    <Text>{furniture.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={handleAddFurniture}>
                            <View style={styles.furnitureOption}>
                                <Text>+ Add</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                    {showAddFurnitureForm && (
                        <View style={styles.addFurnitureForm}>
                            <TextInput
                                placeholder="Enter furniture name"
                                value={newFurnitureName}
                                onChangeText={setNewFurnitureName}
                                style={styles.input}
                            />
                            <TouchableOpacity onPress={handleSubmitNewFurniture}>
                                <View style={[styles.addButton,{marginRight:10}]}>
                                    <Text style={styles.buttonText}><FontAwesome6 name="add" size={20} color="green" /></Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>setShowAddFurnitureForm(false)}>
                                <View style={styles.cancelBtn}>
                                    <Text style={styles.buttonText}><MaterialCommunityIcons name="cancel" size={20} color="red" /></Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.skipButton, { marginRight: 10 }]} onPress={onNext}>
                            <Text style={styles.closeButtonText}>Next</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.closeButton]} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};
export default RoomModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    modalDescription: {
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Optional: Adjust as needed
        marginTop: 10, // Optional: Adjust as needed
    },
    closeButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButton: {
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    furnitureOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    furnitureOption: {
        width: 80,
        height: 60,
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 10,
    },
    selectedFurnitureOption: {
        backgroundColor: 'lightgreen',
    },
    addFurnitureForm: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        paddingHorizontal: 10,
    },
    addButton: {
        backgroundColor: 'lightgrey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelBtn: {
        backgroundColor: 'lightgrey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        
    },
});


