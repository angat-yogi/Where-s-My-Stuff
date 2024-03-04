import React from 'react';
import {Text, View} from 'react-native';
import Heading from '../../../Shared/Heading';
import Header from '../Header';

const Room =({roomData}) => {
//need to get furnitures for that user in this room
    return (
        <View style={{flex:1}}>
            <Header/>
       <Text>Room 1</Text>
        </View>
    );
};

export default Room;
