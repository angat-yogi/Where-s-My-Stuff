import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import RoomModal from '../../Shared/Rooms/RoomModal';
import { useSharedState } from '../../State/SharedStateProvider';

const StorageTypeByRoom = ({ modalVisible, setSelectedRooms, setModalVisible, selectedRooms, handleNavigateToStorageTypes,doneClicked }) => {
    const [roomIndex, setRoomIndex] = useState(0);
    const [currentRoomData, setCurrentRoomData] = useState(selectedRooms[roomIndex]); // State to hold the current room data
    const [disbaleNextBtn, setDisableNextBtn]=useState(false)
    const[disablePrevButton,setDisablePrevButton]=useState(false)
    const { sharedState, setSharedState } = useSharedState();

    const handleCloseModal = () => {
        setModalVisible(false); // Close modal when user clicks "Close"
        setCurrentRoomData(null); // Reset the current room data when modal is closed
        setSelectedRooms([]);
    };

    const handleOpenModal = () => {
        setModalVisible(true); // Open modal when needed

    };

    const handleNextRoom = () => {
        if(roomIndex===selectedRooms.length-1){
            setDisableNextBtn(true);
            //setCurrentRoomData(selectedRooms[currentRoomIndex]); // Update current room data when moving to the next room
        }
        if (roomIndex < selectedRooms.length - 1) {
            setRoomIndex(roomIndex + 1);
            setCurrentRoomData(selectedRooms[roomIndex + 1]); // Update current room data when moving to the next room
            handleOpenModal(); // Open modal when moving to the next room
        } else {
            // Handle logic when all rooms have been traversed
            handleNavigateToStorageTypes();
        }
        setDisablePrevButton(false)
    };

    const handlePreviousRoom = () => {
        if (roomIndex >0) {
            setDisableNextBtn(false);
            setRoomIndex(roomIndex - 1);
            setCurrentRoomData(selectedRooms[roomIndex - 1]); // Update current room data when moving to the next room
            handleOpenModal(); // Open modal when moving to the next room
        } else {
            // Handle logic when all rooms have been traversed
            handleNavigateToStorageTypes();
        }

        if(roomIndex===0){
            setDisablePrevButton(true)
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
                onPrev={handlePreviousRoom}
                disbaleNextBtn={disbaleNextBtn}
                disablePrevButton={disablePrevButton}
                roomIndex={roomIndex}
                totalRooms={selectedRooms.length}
                doneClicked={doneClicked}
            />
        </View>
    );
};

export default StorageTypeByRoom;
