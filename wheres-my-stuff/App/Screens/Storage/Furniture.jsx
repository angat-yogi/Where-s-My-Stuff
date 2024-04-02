import { useUser } from '@clerk/clerk-expo';
import React, { useState } from 'react';
import { Text, View, Button, Modal, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList } from 'react-native';
import ImageAPI from '../../API/ImageAPI';
import Header from '../HomeScreen/Header';
import ItemForm from './Forms/ItemForm';
import * as MediaLibrary from 'expo-media-library';
import GlobalApi from '../../API/GlobalApi';
import Colors from '../../Utils/Colors';

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
    const [editItem,setEditItem]=useState(null);
    const [isAddingNewItem,setIsAddingNewItem]=useState(false)
  const [isEdit,setIsEdit]=useState(false)
    console.log(route)


    const EditItem=(item)=>{
        setEditItem(item);
        setIsEdit(true);
        
    }
    const handleAddItem = async () => {
        setIsNewItemAdditionLoading(true);
        let imageFile=null;
        if(!image.uri.includes('https://')){
            const assetInfo = await MediaLibrary.getAssetInfoAsync(image.id);

            console.log("Assets info",assetInfo)
            const localUri = assetInfo.localUri;
    
            // Create the imageFile object with the local file URI
             imageFile = {
                uri: localUri,
                type: 'image/jpeg',
                name: `${user.firstName}${route.params?.selectedItem.name.trim().toLowerCase()}${newItemName.trim().toLowerCase()}${Date.now().toString()}.jpg`,
            };
        }
           
        try {
            console.log("imageFile", imageFile);
            let imageFromCamera =null;
            if(!image.uri.includes('https://')){
                imageFromCamera = await ImageAPI.uploadImageAPI(imageFile);
                imageFromCamera=imageFromCamera.url;
            }
            else{
                imageFromCamera=image.uri;
            }
    
            let data = {
                id: items.length + 1,
                name: newItemName,
                image: imageFromCamera, // Assuming the API returns the URL of the uploaded image
                brand: brandName,
                room:route.params.room,
                email:user.emailAddresses[0].emailAddress,
                furniture:route.params.selectedItem.name,
                size:newItemSize
            };
//update api to upsert
            await GlobalApi.addItemToFurniture(data).then(async(resp)=>{
                console.log("added item to the fuurniture",resp)
            })
            await fetchItems();
            //setItems([...items, data]);
        } catch (error) {
            console.error('Error uploading image:', error);
            // Handle error here
        } finally {
            setIsNewItemAdditionLoading(false);
            setIsAddingNewItem(false);
            setImage({uri:null,id:''});
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
                        <TouchableOpacity style={styles.imageContainer} onPress={()=>EditItem(item)}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            />
                        </TouchableOpacity>  
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.brandName}> by {item.brand}</Text>
                        </View>
                        <Text style={styles.dateAdded}>Date Added: {item.updatedAt.substring(0, 10)}</Text>         
                        
                    </View>
                    )}
                    numColumns={2}
                />
            );
        }
    };

    const fetchItems = async () => {

        let data = {
            room:route.params.room,
            email:user.emailAddresses[0].emailAddress,
            furniture:route.params.selectedItem.name,
        };

        await GlobalApi.getRoomFurnitureItems(data).then(async (resp) => {
            console.log("resp", resp.furnitureItems);
            
            // Filter out items that already exist in the items state
            const newItems = resp.furnitureItems.filter((item) => {
              return !items.some((existingItem) => existingItem.id === item.id);
            });
            
            // Concatenate the new items with the existing items state
            setItems([...items, ...newItems]);
          });
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
            <TouchableOpacity style={styles.addButton} onPress={()=>setIsAddingNewItem(true)}>
                <Text style={styles.addButtonText}>+ Item</Text>
            </TouchableOpacity>

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
            editItem={editItem}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
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
    addButton: {
        backgroundColor: Colors.PRIMARY,
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

export default Furniture;
