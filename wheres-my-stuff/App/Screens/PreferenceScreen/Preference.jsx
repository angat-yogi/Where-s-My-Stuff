import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, FlatList, Image, Alert } from 'react-native';
import Header from '../HomeScreen/Header';
import { FontAwesome } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import Colors from '../../Utils/Colors';
import RoomForm from './Forms/RoomForm';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import StorageTypeByRoom from './StorageTypeByRoom';
import GlobalApi from '../../API/GlobalApi';
import ImageAPI from '../../API/ImageAPI';
import { useSharedState } from '../../State/SharedStateProvider';

const Preference = () => {
    const navigation = useNavigation();
    const { user, isLoading } = useUser();
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [roomSelectionCompleted, setRoomSelectionCompleted] = useState(false);
    const [newRoomName, setNewRoomName] = useState('');
    const [isAddingNewRoom, setIsAddingNewRoom] = useState(false);
    const [image, setImage] = useState(null);
    const [skip, setSkip] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [rooms, setRooms] = useState([]);
    const [allFurnitures, setAllFurnitures] = useState([]);
    const [error, setError] = useState(false);
    const [selectedRoomType, setSelectedRoomType] = useState(null);
    const [isNewRoomAdditionLoading, setIsNewRoomAdditionLoading] = useState(false);
    const { sharedState, setSharedState } = useSharedState();

    const getFurnitures = async () => {
        try {
            const resp = await GlobalApi.getDefaultFurnitures();
            setAllFurnitures(resp.furnitures);
        } catch (error) {
            console.error("Error fetching default furnitures:", error);
        }
    };

    useEffect(() => {
        getFurnitures();
    }, [selectedRooms.length]);

    useEffect(() => {
        const getRooms = () => {
            try {
                GlobalApi.getDefaultRooms().then(async (resp) => {
                    const customizedRoomsForUser = resp.rooms.filter(r => r.addedBy === 'admin@wms.com' || r.addedBy === user?.emailAddresses[0].emailAddress);
                    setRooms(customizedRoomsForUser);
                });
            } catch (error) {
                console.error("Error fetching default furnitures:", error);
            }
        };
        getRooms();
    }, []);

    useEffect(() => {
        if (roomSelectionCompleted) {
            setModalVisible(true);
        }
    }, [roomSelectionCompleted]);

    const doneClicked = async () => {
        if (!selectedRooms) {
            return;
        }

        try {
            for (const room of selectedRooms) {
                for (const furniture of room.furnitures || []) {
                    const data = {
                        email: user?.emailAddresses[0].emailAddress,
                        room: room.roomDisplayName,
                        furniture: {
                            name: furniture.name,
                            image: furniture.image[0],
                            room: furniture.room,
                            email: user.emailAddresses[0].emailAddress,
                        },
                    };

                    const furnitureExists = sharedState.allFurnitures.some(existingFurniture => existingFurniture.name.toLowerCase().trim() === furniture.name.toLowerCase().trim());
                    
                    if (furnitureExists) {
                        await GlobalApi.addUserInitialOldFurnitures(data);
                        await GlobalApi.publishUserFurnitures();
                    } else {
                        await GlobalApi.addUserInitialNewFurnitures(data);
                        await GlobalApi.publishFurnitures();
                    }
                }
            }

            Alert.alert(
                "Are you sure?",
                "This will close the customization for you and take you to the home page",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: ()=> {
                            setModalVisible(false);
                            navigation.navigate("Go Back");
                        }
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.log("Error adding furniture:", error);
            setError(true);
        }
    };

    const toggleRoomSelection = (room) => {
        setSelectedRooms(prevSelectedRooms => {
            const isSelected = prevSelectedRooms.some(selectedRoom => selectedRoom.id === room.id);
            const updatedRooms = isSelected
                ? prevSelectedRooms.filter(selectedRoom => selectedRoom.id !== room.id)
                : [...prevSelectedRooms, room];
            return updatedRooms;
        });
    };

    const handleAddRoom = async () => {
        if (newRoomName.trim() !== '' && selectedRoomType !== null && image.trim() !== '') {
            let roomExists = rooms.find(r => r.roomDisplayName.toLowerCase() === newRoomName.trim().toLowerCase());
            if (roomExists) {
                Alert.alert("Room already exists","Sorry we already have a name with that Room",[{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
            } else {
                setIsNewRoomAdditionLoading(true);
                const imageFile = {
                    uri: image,
                    type: 'image/jpeg',
                    name: `${user.firstName}${newRoomName.trim().toLowerCase()}${selectedRoomType.trim().toLowerCase()}${Date.now().toString()}.jpg`,
                };
                const imageFromCamera = await ImageAPI.uploadImageAPI(imageFile);
                setIsNewRoomAdditionLoading(false);
                const newRoom = { id: rooms.length + 1, roomDisplayName: newRoomName.trim(), imageUri: imageFromCamera.url, roomType: selectedRoomType };
                const data = {
                    email: user.emailAddresses[0].emailAddress,
                    room: {
                        imageUri: newRoom.imageUri,
                        roomDisplayName: newRoom.roomDisplayName,
                        roomType: newRoom.roomType,
                        addedBy: user.emailAddresses[0].emailAddress
                    }
                };
                GlobalApi.addUserInitialNewRooms(data);
                setRooms([...rooms, newRoom]);
                setNewRoomName('');
                setImage(null);
                setSelectedRoomType(null);
            }
        }
        setIsAddingNewRoom(false);
    };

    const handleAddNewRoom = () => {
        setIsAddingNewRoom(true);
    };

    const handleNavigateToStorageTypes = () => {
        if (selectedRooms.length === 0) {
            setSkip(true);
        }
        if (skip && selectedRooms.length === 0) {
            navigation.navigate('Go Back');
        } else {
            setRoomSelectionCompleted(true);
            setSharedState(prevState => ({
                ...prevState,
                selectedRooms: selectedRooms
            }));
            setModalVisible(roomSelectionCompleted);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Header displayName={false} />
            <View style={styles.contentContainer}>
                <Text style={styles.title}>Welcome, {user.firstName}!</Text>
                <Text style={styles.subtitle}>Let's customize the app for you..</Text>
            </View>
            <View style={styles.roomContainer}>
                <Text style={styles.roomTitle}>Choose/Add Rooms</Text>
                <View style={{backgroundColor:Colors.PRIMARY,borderRadius:20,width:'100%',paddingHorizontal: 10, paddingVertical: 10}}>
                <View style={styles.roomsRow}>
                    {rooms.map((room) => (
                        <TouchableOpacity
                            key={room.id}
                            style={[
                                styles.roomItem,
                                selectedRooms.some((selectedRoom) => selectedRoom.id === room.id) ? styles.selectedRoom : null,
                            ]}
                            onPress={() => toggleRoomSelection(room)}
                        >
                            <Text style={styles.roomName}>{room.roomDisplayName}</Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={handleAddNewRoom} style={styles.roomItem}>
                        <View style={styles.addButton}>
                            <Text style={styles.roomName}>+ Add New Room</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </View>
            </View>
            <RoomForm isNewRoomAdditionLoading={isNewRoomAdditionLoading} selectedRoomType={selectedRoomType} setSelectedRoomType={setSelectedRoomType} handleAddRoom={handleAddRoom} isAddingNewRoom={isAddingNewRoom} newRoomName={newRoomName} setIsAddingNewRoom={setIsAddingNewRoom} setNewRoomName={setNewRoomName} image={image} setImage={setImage}/>
            <View style={{paddingBottom:20,paddingTop:20}}>
                <TouchableOpacity style={styles.nextButton} onPress={handleNavigateToStorageTypes}>
                    {selectedRooms.length !== 0 ? (<Text style={styles.nextButtonText}>Next: Choose Storage Types</Text>) : (<Text style={styles.nextButtonText}>Skip</Text>)}
                </TouchableOpacity>
            </View>
            {roomSelectionCompleted && selectedRooms.length !== 0 && <StorageTypeByRoom setSelectedRooms={setSelectedRooms} selectedRooms={[...selectedRooms]} handleNavigateToStorageTypes={handleNavigateToStorageTypes} modalVisible={modalVisible} setModalVisible={setModalVisible} doneClicked={doneClicked}/>}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginTop: 10,
    },
    roomContainer: {
        paddingHorizontal: 20,
    },
    roomTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    roomItem: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 2,
        borderColor: '#626262',
        borderRadius: 20,
        marginBottom: 10,
    },
    selectedRoom: {
        backgroundColor: '#e6f2ff',
        borderColor: '#5cadff',
    },
    roomsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    nextButton: {
        backgroundColor: "lightgray",
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        alignItems: 'center',
    },
    nextButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Preference;
