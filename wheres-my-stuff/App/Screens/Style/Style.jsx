import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Style = ({ imageTop, imageBottom, imageAccessories }) => {
    const { user, isLoading } = useUser();

    const navigation = useNavigation();

    const navigateToTop = (item) => {
        navigation.navigate('furniture', { selectedItem: {email:user.emailAddresses[0].emailAddress,image:item.image,name:item.furniture}, room: item.room, selectedItemId: item.id});
    };

    const navigateToBottom = (item) => {
        navigation.navigate('furniture', { selectedItem: {email:user.emailAddresses[0].emailAddress,image:item.image,name:item.furniture}, room: item.room, selectedItemId: item.id});
    };

    const navigateToAccessories = (item) => {
        navigation.navigate('furniture', { selectedItem: {email:user.emailAddresses[0].emailAddress,image:item.image,name:item.furniture}, room: item.room, selectedItemId: item.id});
    };

    return (
        <View style={styles.container}>
            <View style={styles.image}>
                <TouchableOpacity onLongPress={navigateToTop}>
                    <Image style={styles.topImage} source={{ uri: imageTop }} />
                </TouchableOpacity>
                <TouchableOpacity onLongPress={navigateToTop}>
                    <Image style={styles.bottomImage} source={{ uri: imageBottom }} />
                </TouchableOpacity>
                {imageAccessories && 
                    <TouchableOpacity onLongPress={navigateToAccessories}>
                        <Image style={styles.accessoriesImage} source={{ uri: imageAccessories }} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', // Center the content vertically
    },
    image: {
        alignItems: 'center', // Center the content horizontally
    },
    topImage: {
        resizeMode: 'contain',
        width: '80%', // Adjust width as needed
        aspectRatio: 1, // Maintain aspect ratio
    },
    bottomImage: {
        marginTop: -10,
        resizeMode: 'contain',
        transform: [{ rotate: '270deg' }],
        width: '100%', // Adjust width as needed
        aspectRatio: 1, // Maintain aspect ratio
    },
    accessoriesImage: {
        width: 50, // Adjust size as needed
        height: 50, // Adjust size as needed
        resizeMode: 'contain',
    },
});

export default Style;
