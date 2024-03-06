import { useUser } from '@clerk/clerk-expo';
import React from 'react';
import { Text, View, Button, Modal, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import Header from '../HomeScreen/Header';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const imageWidth = width / 2;
const Furniture = ({ route }) => {
    console.log(route)
    const { user, isLoading } = useUser();
    const [items, setItems] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);

    const handleAddItem = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const renderItems = () => {
        if (items.length === 0) {
            return (
                <View style={styles.emptyContainer}>
                    <Text>No items to show.</Text>
                </View>
            );
        } else {
            return (
                <FlatList
                    data={items}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity style={styles.imageContainer} onPress={()=>console.log('clicked on item',item)}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            />
                        </TouchableOpacity>  
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.brandName}> by {item.Brand}</Text>
                        </View>
                        <Text style={styles.dateAdded}>Date Added: {new Date().toLocaleDateString()}</Text>         
                        
                    </View>
                    )}
                    numColumns={2}
                />
            );
        }
    };

    const fetchItems = () => {
        // Simulate fetching items from an API
        setItems([
            { id: 1, name: 'Item 1',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UsM005bdou1Rapcc2SnoB18QV_qn2N8zuBqyZtLm2PnalZGLdfZSRlTkbsUCylhiDLM&usqp=CAU", Brand:"Adidas"},
            { id: 2, name: 'Item 2',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREZE9thU7-aMlgaNRkJbTOqHAhL6-d1h3vig&usqp=CAU", Brand:"Target"},
            { id: 3, name: 'Item 3',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHtP8h1QiTizDs8YaUp8hXYH3oEUmpyCmACJUPIIJZSdsjbH3JuhdQxRd5NEOQT_OgEeA&usqp=CAU", Brand:"Puma"},
            { id: 4, name: 'Item 4', image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UsM005bdou1Rapcc2SnoB18QV_qn2N8zuBqyZtLm2PnalZGLdfZSRlTkbsUCylhiDLM&usqp=CAU",Brand:"Nike" },
            { id: 5, name: 'Crop Top',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UsM005bdou1Rapcc2SnoB18QV_qn2N8zuBqyZtLm2PnalZGLdfZSRlTkbsUCylhiDLM&usqp=CAU", Brand:"Adidas"},
            { id: 6, name: 'Short',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREZE9thU7-aMlgaNRkJbTOqHAhL6-d1h3vig&usqp=CAU", Brand:"Nike"},
            { id: 7, name: 'Light Pant',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHtP8h1QiTizDs8YaUp8hXYH3oEUmpyCmACJUPIIJZSdsjbH3JuhdQxRd5NEOQT_OgEeA&usqp=CAU", Brand:"Roshan"},
            { id: 8, name: 'Item 4', image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UsM005bdou1Rapcc2SnoB18QV_qn2N8zuBqyZtLm2PnalZGLdfZSRlTkbsUCylhiDLM&usqp=CAU",Brand:"Nike" },
            { id: 9, name: 'Item 1',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UsM005bdou1Rapcc2SnoB18QV_qn2N8zuBqyZtLm2PnalZGLdfZSRlTkbsUCylhiDLM&usqp=CAU", Brand:"Lulu"},
            { id: 10, name: 'Item 2',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREZE9thU7-aMlgaNRkJbTOqHAhL6-d1h3vig&usqp=CAU", Brand:"Adidas"},
            { id: 11, name: 'Item 3',image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHtP8h1QiTizDs8YaUp8hXYH3oEUmpyCmACJUPIIJZSdsjbH3JuhdQxRd5NEOQT_OgEeA&usqp=CAU", Brand:"Nike"},
            { id: 12, name: 'Item 4', image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0UsM005bdou1Rapcc2SnoB18QV_qn2N8zuBqyZtLm2PnalZGLdfZSRlTkbsUCylhiDLM&usqp=CAU",Brand:"Nike" },
            // Add other items as needed
        ]);
    };

    React.useEffect(() => {
        fetchItems();
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <Text style={{    fontFamily: "ProtestRiot", textAlign:'center', fontSize:30, fontWeight:'bold'}}>{route.params.selectedItem.name}</Text> 
            {!isLoading && (
            <View style={styles.container}>
                {renderItems()}
            <Button title="Add New Item" onPress={handleAddItem} />
            <Modal visible={showModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeading}>Add New Item</Text>
                    <TouchableOpacity style={[styles.closeButton]} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}><AntDesign name="close" size={24} color="red" /></Text>
                        </TouchableOpacity>                
                        </View>
            </Modal>
        </View>)}
        </View>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
      },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    emptyContainer: {
        alignItems: 'center',
    },
    itemContainer: {
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalHeading: {
        fontSize: 20,
        marginBottom: 20,
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
      itemName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        // marginTop: -12, // Adjust this value to reduce the distance between the image and its name
    },
    brandName: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
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
    dateAdded: {
        textAlign: 'center',
        fontSize: 14,
        color: 'gray',
    },
});

export default Furniture;
