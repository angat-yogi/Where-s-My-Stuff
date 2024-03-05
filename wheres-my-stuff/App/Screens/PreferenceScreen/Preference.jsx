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
import { data } from '@tensorflow/tfjs';
const Preference = () => {
    const navigation = useNavigation();
    const { user, isLoading } = useUser();
    const [selectedRooms, setSelectedRooms] = useState([]);
    const [roomSelectionCompleted, setRoomSelectionCompleted]=useState(false)
    const [newRoomName, setNewRoomName] = useState('');
    const [isAddingNewRoom, setIsAddingNewRoom] = useState(false);
    const [image, setImage] = useState(null);
    const [skip,setSkip]=useState(false);
    const [modalVisible, setModalVisible] = useState(false); // Initialize modal visibility state as false
    const [rooms,setRooms] = useState([
        { id: 1, name: 'Living Room',imageUri:"https://media.architecturaldigest.com/photos/64f71af50a84399fbdce2f6a/16:9/w_2560%2Cc_limit/Living%2520with%2520Lolo%2520Photo%2520Credit_%2520Life%2520Created%25204.jpg",furnitures:[] },
        { id: 2, name: 'Bedroom',imageUri:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEQcT8uoUn58QbzQV5k12g61GMUu6Io7nH3g&usqp=CAU" ,furnitures:[]},
        { id: 3, name: 'Kitchen',imageUri:"https://stylebyemilyhenderson.com/wp-content/uploads/2023/03/Emily-Henderson_Small-Kitchen-Ideas_7.jpg",furnitures:[] },
        { id: 4, name: 'Bathroom',imageUri:"https://images.thdstatic.com/lifestyleimages/1024x682/b3c414af-4a89-4ba9-9ba9-3e91a8b697d40.jpeg",furnitures:[] },
        { id: 5, name: 'Garage',imageUri:"https://www.southernliving.com/thmb/eHRQ7ZS7AFXBdQU2wXk6b2rmEuU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-528098460-2000-6cf3c18930e847faa18842c9eb84c3cf.jpg",furnitures:[] },
        { id: 6, name: 'Store Room',imageUri:"https://img.staticmb.com/mbcontent/images/crop/uploads/2023/1/Free-Standing-Units-for-Simple-Store-Room-Design_0_1200.jpg",furnitures:[]},
        { id: 7, name: '+ Add New Room',imageUri:"" }, // Add New Room option
    ]);
    const [allFurnitures, setAllFurnitures] = useState([]);
    const [error,setError]=useState(false);
useEffect(()=>{
    const getFurnitures = () => {
        try{
        GlobalApi.getDefaultFurnitures().then(async (resp) => {
            setAllFurnitures(resp.furnitures)
        })
        }
        catch(error){
            console.error("Error fetching default furnitures:", error);
        };

        console.log("Api called from preference",allFurnitures)

    };
    getFurnitures();
},[selectedRooms.length])

    useEffect(() => {
        if (roomSelectionCompleted) {
            setModalVisible(true); // Open the modal when room selection is completed
        }
    }, [roomSelectionCompleted]);
    // const toggleRoomSelection = (room) => {
    //     console.log(rooms);
    //     console.log("selectedRooms",selectedRooms)
    //     if (room.id === 7) {
    //         setIsAddingNewRoom(true);
    //     } else {
    //         if (selectedRooms.some((selectedRoom) => selectedRoom.id === room.id)) {
    //             setSelectedRooms(selectedRooms.filter((selectedRoom) => selectedRoom.id !== room.id));
    //         } else {
    //             setSelectedRooms([...selectedRooms, room]);
    //         }
    //     }
    //     console.log("selectedRooms after removed",selectedRooms)

    // };

    const doneClicked = async () => {
        if (!selectedRooms) {
            return; // Exit if no rooms are selected
        }
    
        for (const room of selectedRooms) {
            for (const furniture of room.furnitures || []) {
                const data = {
                    email: user?.emailAddresses[0].emailAddress,
                    room: room.name,
                    furniture: {
                        name: furniture.name,
                        image: furniture.image[0],
                        room:furniture.room,
                        email:user.emailAddresses[0].emailAddress
                    }
                };
    
                console.log("data going into API",data)
                try {
                    const furnitureExists = allFurnitures.some(existingFurniture => existingFurniture.name === furniture.name);
                    if (furnitureExists) {
                        console.log(`Furniture ${furniture.name} already exists.`);
                        GlobalApi.addUserInitialOldFurnitures(data).then(async(resp)=>{
                            console.log("resp from existing",resp)
                        })
                    } else {
                        console.log(`Furniture ${furniture.name} does not exists.`);
                        GlobalApi.addUserInitialNewFurnitures(data).then(async(resp)=>{
                            console.log("resp from new",resp)
                        })
                    }
                } catch (error) {
                    console.log("Error adding furniture:", error);
                    setError(true)
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
                    style: "cancel"
                },
                {
                    text: "OK",
                    onPress: async () => {
                        // Close the modal
                        setModalVisible(false);
                        // Publish furnitures
                        try {
                            if(!error){
                                setError(false)
                               await GlobalApi.publishFurnitures().then(async (resp) => {
                                    console.log(`success in publishing all the furnitures for user: ${user.firstName}`, resp);
                                 });
                            }
                    
                            if(!error){
                                setError(false)
                                await GlobalApi.publishUserFurnitures().then(async (resp) => {
                                    console.log(`success in publishing all the user furnitures for user: ${user.firstName}`, resp);
                                 });
                                }
                            navigation.navigate("Go Back");
                        } catch (error) {
                            console.error("Error publishing furnitures:", error);
                            // Handle error appropriately
                        }
                    }
                }
            ],
            { cancelable: false }
        );
        
         
    };
    


    const toggleRoomSelection = (room) => {
        setSelectedRooms(prevSelectedRooms => {
            if (room.id === 7) {
                setIsAddingNewRoom(true);
                return prevSelectedRooms; // No change to selectedRooms when adding a new room
            } else {
                const isSelected = prevSelectedRooms.some(selectedRoom => selectedRoom.id === room.id);
                const updatedRooms = isSelected
                    ? prevSelectedRooms.filter(selectedRoom => selectedRoom.id !== room.id) // Deselect the room
                    : [...prevSelectedRooms, room]; // Select the room
                return updatedRooms;
            }
        });
        console.log("selectedRooms after removed",selectedRooms)

    };
    
 
    const handleAddRoom = () => {
    if (newRoomName.trim() !== '') {
        let roomExists=rooms.find(r=>r.name.toLowerCase()===newRoomName.trim().toLowerCase());
        if(roomExists){
            Alert.alert("Room already exists","Sorry we already have a name with that Room",[{ text: 'OK', onPress: () => console.log('OK Pressed') }])
        }
        else{
        const newRoom = { id: rooms.length + 1, name: newRoomName.trim() ,imageUri:image};
        let updatedRooms = [...rooms.filter(room => room.id !== 7), newRoom]; // Exclude room with ID 7, then add the new room
        updatedRooms.push(rooms.find(room => room.id === 7)); // Add the room with ID 7 (Add New Room option) to the end
        setRooms(updatedRooms)
        setNewRoomName('');
        setImage(null)
        }
    }
    setIsAddingNewRoom(false);
};

const handleNavigateToStorageTypes = () => {
    // Implement navigation logic to navigate to the screen/modal where users can choose storage types
    console.log("selectedRooms in handle",selectedRooms)
    if(selectedRooms.length===0){
        setSkip(true)
    }
    if(skip&&selectedRooms.length===0){
        navigation.navigate('Go Back')
    }
    else{
        console.log('Clicked')
        setRoomSelectionCompleted(true)
        setModalVisible(roomSelectionCompleted)
        console.log("modal from prefrence",modalVisible)
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
                    {/* Render rooms */}
                    {rooms.map((room) => (
                        <TouchableOpacity
                            key={room.id}
                            style={[
                                styles.roomItem,
                                selectedRooms.some((selectedRoom) => selectedRoom.id === room.id) ? styles.selectedRoom : null,
                            ]}
                            onPress={() => toggleRoomSelection(room)}
                        >
                            <Text style={styles.roomName}>{room.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                </View>
                
            </View>
        <RoomForm handleAddRoom={handleAddRoom} isAddingNewRoom={isAddingNewRoom} newRoomName={newRoomName} setIsAddingNewRoom={setIsAddingNewRoom} setNewRoomName={setNewRoomName} image={image} setImage={setImage}/>
       <View style={{paddingBottom:20,paddingTop:20}}>
       <TouchableOpacity style={styles.nextButton} onPress={handleNavigateToStorageTypes}>
                {selectedRooms.length!=0?(<Text style={styles.nextButtonText}>Next: Choose Storage Types</Text>):(<Text style={styles.nextButtonText}>Skip</Text>)}
        </TouchableOpacity>
       </View>
        {roomSelectionCompleted&&selectedRooms.length!==0&&<StorageTypeByRoom selectedRooms={[...selectedRooms]} handleNavigateToStorageTypes={handleNavigateToStorageTypes} modalVisible={modalVisible} setModalVisible={setModalVisible} doneClicked={doneClicked}/>}
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
