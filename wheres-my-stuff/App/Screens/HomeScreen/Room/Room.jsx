import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet, Dimensions } from 'react-native';
import GlobalApi from '../../../API/GlobalApi';
import Heading from '../../../Shared/Heading';
import Header from '../Header';
import { useUser } from '@clerk/clerk-expo';
const { width } = Dimensions.get('window');
const imageWidth = width / 2;
const Room = ({ route }) => {
    const { user, isLoading } = useUser();
    const [userFurnitures, setUserFurnitures] = useState([]);
   console.log(route)
    const getFurnitures = () => {
        try {
            GlobalApi.getDefaultFurnitures().then(async (resp) => {
                console.log(resp)
                const allDeafultRoomFurnitures = resp.furnitures.filter(item => item.email === 'admin@wms.com' );
                const allUserAddedRoomFurnitures = resp.furnitures.filter(item => item.email === user.emailAddresses[0].emailAddress || item.room?.toLowerCase()===route.params.selectedItem.roomDisplayName.toLowerCase() );
                const filteredFurnitures = Array.from(new Set([...allDeafultRoomFurnitures, ...allUserAddedRoomFurnitures]));

                setUserFurnitures(filteredFurnitures);
            })
        } catch (error) {
            console.error("Error fetching default furnitures:", error);
        };
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
                                  <TouchableOpacity key={index} style={styles.imageContainer}>
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
      width: imageWidth*0.95,
      height: imageWidth,
      margin: 5,
      justifyContent: 'center',
      alignItems: 'center',
      padding:15

    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: -12, // Adjust this value to reduce the distance between the image and its name
    },
  });
  

export default Room;

