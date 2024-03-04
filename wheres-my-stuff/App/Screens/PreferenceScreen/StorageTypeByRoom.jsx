import React, { useState } from 'react';
import { View } from 'react-native';
import RoomModal from '../../Shared/Rooms/RoomModal';

const StorageTypeByRoom = ({ modalVisible, setModalVisible, selectedRooms, handleNavigateToStorageTypes }) => {
    const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
    const [currentRoomData, setCurrentRoomData] = useState(selectedRooms[currentRoomIndex]); // State to hold the current room data

    const handleCloseModal = () => {
        setModalVisible(false); // Close modal when user clicks "Close"
        setCurrentRoomData(null); // Reset the current room data when modal is closed
    };

    const handleOpenModal = () => {
        setModalVisible(true); // Open modal when needed
    };

    const handleNextRoom = () => {
        if (currentRoomIndex < selectedRooms.length - 1) {
            setCurrentRoomIndex(currentRoomIndex + 1);
            setCurrentRoomData(selectedRooms[currentRoomIndex + 1]); // Update current room data when moving to the next room
            handleOpenModal(); // Open modal when moving to the next room
        } else {
            // Handle logic when all rooms have been traversed
            handleNavigateToStorageTypes();
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <RoomModal
                modalVisible={modalVisible}
                data={currentRoomData} // Pass the current room data to the modal
                onNext={handleNextRoom}
                setModalVisible={setModalVisible}
                onClose={handleCloseModal}
            />
        </View>
    );
};

export default StorageTypeByRoom;
