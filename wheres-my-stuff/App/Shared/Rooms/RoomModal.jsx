import React, { useEffect, useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView, TextInput, KeyboardAvoidingView, PanResponder, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import GlobalApi from '../../API/GlobalApi';
import ImageOrCamera from '../ImageOrCamera';
import { useUser } from '@clerk/clerk-expo';

const RoomModal = ({ modalVisible, data, onNext, setModalVisible, onClose,onPrev,disbaleNextBtn,disablePrevButton,totalRooms,roomIndex,doneClicked }) => {
    const { user, isLoading } = useUser();
    const [loading, setLoading] = useState(true); // State variable to track loading state
    const [openCameraModal,setOpenCameraModal]=useState(false)
    const [imageUri,setImageUri]=useState(null)
    const [allFurnitures, setAllFurnitures] = useState([]);

useEffect(()=>{
    const getFurnitures = () => {
        try{
        GlobalApi.getDefaultFurnitures().then(async (resp) => {
            const nullRoomFurnitures = resp.furnitures.filter(item => item.email === 'admin@wms.com'||item.email === user.emailAddresses[0].emailAddress);
            const matchingRoomFurnitures = resp.furnitures.filter(item => item.room && item.room.toLowerCase() === data.name.toLowerCase());
            const filteredFurnitures = Array.from(new Set([...nullRoomFurnitures, ...matchingRoomFurnitures]));
            
            setAllFurnitures(resp.furnitures)
            setFurnitures(filteredFurnitures);
            setLoading(false)
        })
        }
        catch(error){
            console.error("Error fetching default furnitures:", error);
        };

        console.log("Api called",furnitures)

    };
    getFurnitures();
},[data.name])

    
    const [furnitures, setFurnitures] = useState([]);
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
        console.log("selectedFurnitures",selectedFurnitures)
    };

    const prevClicked=()=>{
        setSelectedFurnitures([]);
        onPrev();
        setShowAddFurnitureForm(false)

    }

    const nextClicked=()=>{
        data.furnitures=selectedFurnitures;
        setSelectedFurnitures([]);

        onNext()
        setShowAddFurnitureForm(false)

    }

    
    const handleAddFurniture = () => {
        setShowAddFurnitureForm(true);
    };

    const handleSubmitNewFurniture = () => {
        // Add the new furniture to the list
        if(newFurnitureName.trim()===''||newFurnitureName==null||imageUri===null){
            Alert.alert("Invalid Name","Furniture name  or Image can not be empty");
            return null;
        }

        if (allFurnitures.some(furniture => furniture.name.toLowerCase() === newFurnitureName.toLocaleLowerCase())) {
            Alert.alert("Duplicate Name", "A furniture with the same name already exists");
            return;
        }
        const newFurniture = { id: allFurnitures.length + 1, name: newFurnitureName,image:[imageUri] };
        console.log("adding new furniture",newFurniture)
        setFurnitures([...furnitures, newFurniture]);
        setAllFurnitures([...allFurnitures,newFurniture])
        // Reset the form and hide it
        setNewFurnitureName('');
        setImageUri(null)
        setShowAddFurnitureForm(false);
    };

   
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;



    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
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
                            {furniture.image?.length > 0 && <Image source={{ uri:  furniture.image[0] }} style={styles.furnitureImage} />}
                            <Text style={styles.furnitureName}>{furniture.name}</Text>
                        </View>
                    </TouchableOpacity>
                         ))}

                    <TouchableOpacity onPress={handleAddFurniture} style={styles.addButtonContainer}>
                        <View style={styles.addButton}>
                            <Text style={styles.addButtonText}>+ Add</Text>
                        </View>
                    </TouchableOpacity>

                    </ScrollView>
                    {showAddFurnitureForm && (
                        <View style={styles.addFurnitureForm}>
                            <View style={styles.imageContainer}>
                                <TextInput
                                    placeholder="Enter furniture name"
                                    value={newFurnitureName}
                                    onChangeText={setNewFurnitureName}
                                    style={styles.input}
                                />
                            </View>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity onPress={()=>setOpenCameraModal(true)}>
                            {imageUri ?(<TouchableOpacity onPress={()=>setOpenCameraModal(true)}><Image source={{ uri: imageUri }} style={styles.furnitureImageForm} /></TouchableOpacity>):(             
                            <View style={[styles.addButtonForm, { marginRight: 10 }]}>
                            <Text style={styles.buttonText}><FontAwesome6 name="image" size={20} color="green" /></Text>
                            </View>
                            )}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSubmitNewFurniture}>
                                    <View style={[styles.addButtonForm, { marginRight: 10 }]}>
                                        <Text style={styles.buttonText}><FontAwesome6 name="add" size={20} color="green" /></Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setShowAddFurnitureForm(false)}>
                                    <View style={styles.cancelBtn}>
                                        <Text style={styles.buttonText}><MaterialCommunityIcons name="cancel" size={20} color="red" /></Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {openCameraModal&&(<ImageOrCamera isVisible={openCameraModal} setOpenCameraModal={setOpenCameraModal} displayCamera={true} displayImagePicker={true} imageUri={imageUri} setImageUri={setImageUri}/>)}
                        </View>
                    )}
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity  
                        style={[styles.skipButton, { 
                            marginRight: 10,
                            opacity: disablePrevButton ? 0.5 : 1, // Adjust opacity based on disabled state
                            backgroundColor: disablePrevButton ? '#CCCCCC' : 'transparent', // Change background color based on disabled state
                            borderWidth: disablePrevButton ? 0 : 1, // Remove border when disabled
                        }]} 
                        onPress={prevClicked} 
                        disabled={disablePrevButton}
                    >
                        <Text style={styles.closeButtonText}>
                            <AntDesign name="caretleft" size={24} color={disablePrevButton ? '#999999' : 'black'} /> {/* Change icon color based on disabled state */}
                        </Text>
                    </TouchableOpacity>
                   
                    <TouchableOpacity  
                        style={[styles.skipButton]} 
                        onPress={disbaleNextBtn&&(roomIndex===totalRooms-1)?doneClicked:nextClicked} >
                        <Text style={styles.closeButtonText}>
                            {disbaleNextBtn&&(roomIndex===totalRooms-1)?(<Ionicons name="checkmark-done" size={24} color={'green'}  />):(<AntDesign name="caretright" size={24} color={disbaleNextBtn &&(roomIndex===totalRooms-1)? '#999999' : 'green'} />)} {/* Change icon color based on disabled state */}
                        </Text>
                    </TouchableOpacity>


                        <TouchableOpacity style={[styles.closeButton]} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}><AntDesign name="close" size={24} color="red" /></Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
        </ScrollView>
    );
};
export default RoomModal;

const styles = StyleSheet.create({
    scrollViewContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        marginBottom:10
    },
    closeButton: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 5,
        borderWidth:1
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        
    },
    skipButton: {
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 5,
        borderWidth:1,
        marginRight:10
    },
    selectedImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
    },
    furnitureOptionsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop:20
    },
    furnitureOption: {
        width: 100, // Adjust width as needed
        alignItems: 'center',
        marginHorizontal: 5, // Adjust horizontal margin as needed
        marginBottom: 10, // Add margin bottom for spacing between images
    },
    furnitureImage: {
        width: 80, // Adjust width as needed
        height: 80, // Adjust height as needed
        marginBottom: 5,
        marginTop:5,
        borderRadius:10
    },
    furnitureImageForm: {
        width: 50, // Adjust width as needed
        height: 50, // Adjust height as needed
        marginBottom: 2,
        borderRadius:10,
        marginRight:10

    },
    furnitureName: {
        textAlign: 'center',
    },
    selectedFurnitureOption: {
        backgroundColor: 'lightgreen',
    },
    addFurnitureForm: {
        marginTop: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonRow: {
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
    addButtonForm: {
        backgroundColor: 'lightgrey',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    addButtonContainer: {
        marginRight: 5, // Adjust margin right as needed
    },
    addButton: {
        width: 100, // Adjust width as needed
        height: 110, // Adjust height as needed
        backgroundColor: 'lightblue',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5, // Adjust horizontal margin as needed
        marginBottom: 10, // Add margin bottom for spacing between images
        borderRadius: 10,
        borderWidth:1
    },
    addButtonText: {
        textAlign: 'center',
        fontSize:18,
        fontWeight:'bold'
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


