import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import GlobalApi from '../../../API/GlobalApi';
import Heading from '../../../Shared/Heading';
import Header from '../Header';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');
const imageWidth = width / 2;
const Room = ({ route }) => {
    const { user, isLoading } = useUser();
    const [userFurnitures, setUserFurnitures] = useState([]);
    const getFurnitures = () => {
        try {
            GlobalApi.getUserFurnitures().then(async (resp) => {

                const filteredFurnitures = [];
                const addedFurnitureIds = []; // Array to store the IDs of furniture items already added

                resp.userFurnitures.forEach(userFurniture => {
                    userFurniture.furnitures?.forEach(furniture => {
                        // Check if the furniture meets the criteria and has not been added before
                        if ((userFurniture.userEmail === user.emailAddresses[0].emailAddress &&
                                userFurniture.room?.toLowerCase().replace(/\s/g, '') === route.params.selectedItem.roomType.toLowerCase())
                        ) {
                            // Check if the furniture ID is not already in the addedFurnitureIds array
                            if (!addedFurnitureIds.includes(furniture.id)) {
                                // Add the furniture to the filtered list
                                filteredFurnitures.push(furniture);
                                // Add the furniture ID to the addedFurnitureIds array
                                addedFurnitureIds.push(furniture.id);
                            }
                        }
                    });
                });

                setUserFurnitures(filteredFurnitures);
            });
        } catch (error) {
            console.error("Error fetching default furnitures:", error);
        };
    };

    const navigation = useNavigation();
    const goToFurniture = (item) => {
      if (item) {
        navigation.navigate('furniture',{selectedItem:item})    } else {
        return;
      }
    };


    useEffect(() => {
        if (!isLoading) {
            // Fetch user furnitures only when user data is fully loaded
            getFurnitures();
        }
    }, [isLoading]);

    return (
        <View style={styles.container}>
            <Header />
            <Text style={{    fontFamily: "ProtestRiot", textAlign:'center', fontSize:30, fontWeight:'bold'}}>{route.params.selectedItem.roomDisplayName}</Text> 
            {!isLoading && (
                <View style={styles.container}>
                <FlatList
                  data={userFurnitures}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View>
                      {item.image.map((image, index) => (
                                  <TouchableOpacity key={index} style={styles.imageContainer} onPress={()=>goToFurniture(item)}>
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
      padding:5

    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      borderRadius:20
    },
    imageName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        // marginTop: -12, // Adjust this value to reduce the distance between the image and its name
    },
  });
  

export default Room;

