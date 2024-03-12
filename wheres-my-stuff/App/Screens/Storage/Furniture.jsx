import { useUser } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { Text, View, Button, Modal, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import ImageAPI from '../../API/ImageAPI';
import Header from '../HomeScreen/Header';
import ItemForm from './Forms/ItemForm';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const imageWidth = width / 2;
const Furniture = ({ route }) => {
    const { user, isLoading } = useUser();
    const [items, setItems] = React.useState([]);
    const [image, setImage]=useState({uri:null,id:''});
    const [isNewItemAdditionLoading,setIsNewItemAdditionLoading]=useState(false)
    const [newItemName,setNewItemName]=useState('')
    const [brandName, setBrandName]=useState('')
    const[newItemSize,setNewItemSize]=useState('')
    
    const [isAddingNewItem,setIsAddingNewItem]=useState(false)

    console.log(route)


    const handleAddItem = async () => {
        setIsNewItemAdditionLoading(true);
    
        const assetInfo = await MediaLibrary.getAssetInfoAsync(image.id);

        console.log("Assets info",assetInfo)
        const localUri = assetInfo.localUri;

        // Create the imageFile object with the local file URI
        const imageFile = {
            uri: localUri,
            type: 'image/jpeg',
            name: `${user.firstName}${route.params?.selectedItem.name.trim().toLowerCase()}${newItemName.trim().toLowerCase()}${Date.now().toString()}.jpg`,
        };
    
        
        try {
            console.log("imageFile", imageFile);
            const imageFromCamera = await ImageAPI.uploadImageAPI(imageFile);
        
            let data = {
                id: items.length + 1,
                name: newItemName,
                image: imageFromCamera.url, // Assuming the API returns the URL of the uploaded image
                Brand: brandName
            };
    
            setItems([...items, data]);
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle error here
        } finally {
            setIsNewItemAdditionLoading(false);
            setIsAddingNewItem(false);
            setImage(null);
            setBrandName('')
            setNewItemName('')
            setNewItemSize('')
        }
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
            <Button title="Add New Item" onPress={()=>setIsAddingNewItem(true)} />
            <ItemForm isNewItemAdditionLoading={isNewItemAdditionLoading}
            furnitureType={route.params?.selectedItem.name}
            image={image}
            setImage={setImage}
            isAddingNewItem={isAddingNewItem}
            setIsAddingNewItem={setIsAddingNewItem}
            newItemName={newItemName}
            setNewItemName={setNewItemName}
            handleAddItem={handleAddItem}
            brandName={brandName}
            setBrandName={setBrandName}
            newItemSize={newItemSize}
            setNewItemSize={setNewItemSize}
            />
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
