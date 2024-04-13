import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import GlobalApi from '../../../API/GlobalApi';
import Header from '../Header';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../../Utils/Colors';

const { width } = Dimensions.get('window');
const imageWidth = width / 2;

const Room = ({ route }) => {
    const { user, isLoading } = useUser();
    const [userFurnitures, setUserFurnitures] = useState([]);

    const getFurnitures = () => {
        try {
            GlobalApi.getUserFurnitures().then(async (resp) => {
                const filteredFurnitures = [];
                const addedFurnitureIds = [];

                resp.userFurnitures.forEach(userFurniture => {
                    userFurniture.furnitures?.forEach(furniture => {
                        if ((userFurniture.userEmail === user.emailAddresses[0].emailAddress &&
                                userFurniture.room?.toLowerCase().replace(/\s/g, '') === route.params.selectedItem.roomType.toLowerCase())
                        ) {
                            if (!addedFurnitureIds.includes(furniture.id)) {
                                filteredFurnitures.push(furniture);
                                addedFurnitureIds.push(furniture.id);
                            }
                        }
                    });
                });
                
                setUserFurnitures(filteredFurnitures);
                console.log("furniture,",userFurnitures)

            });
        } catch (error) {
            console.error("Error fetching default furnitures:", error);
        };
    };

    const navigation = useNavigation();
    const goToFurniture = (item) => {
        if (item) {
            navigation.navigate('furniture', { selectedItem: item, room: route.params.selectedItem.roomType });
        } else {
            return;
        }
    };

    useEffect(() => {
        if (!isLoading) {
            getFurnitures();
        }
    }, [isLoading]);

    const handleAddItem = () => {
        console.log("Adding new furniture");
    };

    return (
        <View style={styles.container}>
            <Header />
            <Text style={{ fontFamily: "ProtestRiot", textAlign: 'center', fontSize: 30, fontWeight: 'bold' }}>{route.params.selectedItem.roomDisplayName}</Text>
            {!isLoading && (
                <View style={styles.container}>
                    <FlatList
                        data={userFurnitures}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View>
                                {item.image.map((image, index) => (
                                    <TouchableOpacity key={index} style={styles.imageContainer} onPress={() => goToFurniture(item)}>
                                        <Image
                                            source={{ uri: image }}
                                            style={styles.image}
                                        />
                                    </TouchableOpacity>
                                ))}
                                <Text style={styles.imageName}>{item.name}</Text>
                            </View>
                        )}
                        numColumns={2}
                    />
                </View>
            )}
            <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
                <Text style={styles.addButtonText}>+ Furniture</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    imageContainer: {
        width: imageWidth,
        height: imageWidth,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 20
    },
    imageName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
    },
    addButton: {
        backgroundColor: Colors.BEIGE,
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginTop: 20,
        alignSelf: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Room;
