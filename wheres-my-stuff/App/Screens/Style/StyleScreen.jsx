import React, { useState, useRef, useEffect } from 'react';
import { PanResponder, View, FlatList, Image, LayoutAnimation, TouchableOpacity, StyleSheet, Alert, ImageBackground,Animated, Text, Button } from 'react-native';
import Colors from '../../Utils/Colors';
import Header from '../HomeScreen/Header';
import * as MediaLibrary from 'expo-media-library';

const StyleScreen = () => {
  // should load from api later
  const [topWearData, setTopWearData] = useState([
]);
  const [bottomWearData, setBottomWearData] = useState([
]);


  const [accessoriesData, setAccessoriesData] = useState([
  ]);

  const loadImagesFromFolder = async () => {
    const folderName = 'WMS'; // Name of the folder in the gallery
    let album = await MediaLibrary.getAlbumAsync(folderName);
    const assets = await MediaLibrary.getAssetsAsync({ album: album, sortBy: ['creationTime'], sortOrder: 'desc' });

    if (assets && assets.assets && Array.isArray(assets.assets)) {
      // Check if assets.assets is defined and is an array before proceeding
      const topWearImages = assets.assets.slice(0, 5).map((asset) => ({ id: asset.id, image: asset.uri }));
      const bottomWearImages = assets.assets.slice(5, 10).map((asset) => ({ id: asset.id, image: asset.uri }));
      const accessoriesImages = assets.assets.slice(10).map((asset) => ({ id: asset.id, image: asset.uri }));
  
      setTopWearData(topWearImages);
      setBottomWearData(bottomWearImages);
      setAccessoriesData(accessoriesImages);
    } else {
      console.error("Failed to load assets from the specified folder.");
    }
  };

  useEffect(() => {
    // Load images when the component mounts
    loadImagesFromFolder();
  }, []);

  const [middleSectionImages, setMiddleSectionImages] = useState([]);
  const [imagePositions, setImagePositions] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const addImageToMiddleSection = (item, section) => {
    // Add the item to the middle section with section information
    setMiddleSectionImages([...middleSectionImages, { id: item.id, image: item.image, section }]);
    // Filter out the added item from its original section based on its ID
    switch (section) {
      case 'topWear':
        setTopWearData(topWearData.filter((topWearItem) => topWearItem.id !== item.id));
        break;
      case 'bottomWear':
        setBottomWearData(bottomWearData.filter((bottomWearItem) => bottomWearItem.id !== item.id));
        break;
      case 'accessories':
        setAccessoriesData(accessoriesData.filter((accessoriesItem) => accessoriesItem.id !== item.id));
        break;
      default:
        break;
    }
  };
  
  const removeImageFromMiddleSection = (image) => {
    // Remove the image from the middle section
    const updatedMiddleSectionImages = middleSectionImages.filter(item => item !== image);
    setMiddleSectionImages(updatedMiddleSectionImages);
    
    // Add the image back to its original section based on its ID
    const updatedTopWearData = topWearData;
    const updatedBottomWearData = bottomWearData;
    const updatedAccessoriesData = accessoriesData;

    // Find the item in the middle section by image URL
    const removedItem = middleSectionImages.find(item => item === image);
    if (removedItem) {
      // Add the item back to its original section based on its ID
      switch (removedItem.section) {
        case 'topWear':
          updatedTopWearData.push({ id: removedItem.id, image: removedItem.image });
          setTopWearData(updatedTopWearData);
          break;
        case 'bottomWear':
          updatedBottomWearData.push({ id: removedItem.id, image: removedItem.image });
          setBottomWearData(updatedBottomWearData);
          break;
        case 'accessories':
          updatedAccessoriesData.push({ id: removedItem.id, image: removedItem.image });
          setAccessoriesData(updatedAccessoriesData);
          break;
        default:
          break;
      }
    }
  };
  
  const pan = useRef(new Animated.ValueXY()).current;
  useEffect(() => {
    // Update coordinates when pan changes
    pan.addListener((value) => {
      setCoordinates({ x: value.x, y: value.y });
    });
    return () => {
      pan.removeAllListeners();
    };
  }, []);
  useEffect(() => {
    if (middleSectionImages.length > 0) {
      const initialPositions = middleSectionImages.map(() => new Animated.ValueXY());
      setImagePositions(initialPositions);
    }
  }, [middleSectionImages]);

const updateImagePositions = (coordinatesData) => {
  const updatedPositions = [...imagePositions];
  coordinatesData.forEach((coordinate) => {
    const { id, xCoordinate, yCoordinate } = coordinate;
    const index = middleSectionImages.findIndex((item) => item.id === id);
    if (index !== -1) {
      updatedPositions[index] = new Animated.ValueXY({ x: xCoordinate, y: yCoordinate });
    }
  });

  setImagePositions(updatedPositions);
};

const imageCoordinates={};
const panResponder = middleSectionImages.map((_, index) => {
  if (imagePositions[index]) {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        // Log the position of the dragged image
        imageCoordinates[middleSectionImages[index]] = { x: gesture.dx, y: gesture.dy };
        Animated.event(
          [null, { dx: imagePositions[index].x, dy: imagePositions[index].y }],
          { useNativeDriver: false }
        )(event, gesture);
      },
    });
  } else {
    return PanResponder.create({}); // Create an empty PanResponder if position is undefined
  }
});
  const renderDraggableItem = (item,section) => {
    return (
      <TouchableOpacity style={styles.imageContainer} onPress={() => addImageToMiddleSection(item,section)}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
    <Header icon="camera" action="Camera" />
    <View style={styles.topSection}>
      <View style={styles.leftSection}>
      <View style={styles.textSection}>
        <Text>Top Wear</Text>
      </View>
        <FlatList
          data={topWearData}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => renderDraggableItem(item,'topWear')}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />      
      </View>
      <View style={styles.middleSection}>
      <View style={styles.middleContent}>
        {middleSectionImages.map((image, index) => {
          return (
            <Animated.View
              key={index}
              style={[
                styles.box,
                {
                  transform: [
                    { translateX: imagePositions[index]?.x ?? 0 },
                    { translateY: imagePositions[index]?.y ?? 0 },
                    { rotate: "0deg" },
                  ],
                },
              ]}
              {...panResponder[index].panHandlers}
            >
              <TouchableOpacity onPress={() => removeImageFromMiddleSection(image)}>
                <Text style={styles.removeIcon}>X</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: image.image }}
                style={styles.innerBox}
              />
            </Animated.View>
          );
        })}
      </View>
      <Button title='Save' />
    </View>

      <View style={styles.rightSection}>
      <View style={styles.textSection}>
        <Text>Bottoms</Text>
      </View>
        <FlatList
          data={bottomWearData}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={({ item }) => renderDraggableItem(item,'bottomWear')}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />   
      </View>
    </View>
    <View style={styles.bottomSection}>
    <View style={styles.textSection}>
        <Text>Accessories</Text>
      </View>
      <FlatList
        data={accessoriesData}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingRight: 16 }}
        renderItem={({ item }) => renderDraggableItem(item,'accessories')}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />   
    </View>
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
},
topSection: {
  flex: 1,
  flexDirection: 'row',
},
leftSection: {
  flex: 1,
  backgroundColor: Colors.GRAY,
  justifyContent: 'center',
  alignItems: 'center',
},
rightSection: {
  flex: 1,
  backgroundColor: Colors.GRAY,
  justifyContent: 'center',
  alignItems: 'center',
},
middleSection: {
  flex: 2.5,
  backgroundColor: Colors.WHITE,
  justifyContent: 'center',
  alignItems: 'center',
},
bottomSection: {
  flex: 0.28,
  backgroundColor: Colors.GRAY,
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom:3
},
imageContainer: {
  margin: 1.3
},
image: {
  width: 80,
  height: 100,
  borderRadius:5,
  borderWidth:1
},
imagebg:{
  height:'100%',
  width:'100%'
},
innerBox: {
  height: 90,
  width: 90,
  backgroundColor: "blue",
  borderRadius: 5,
},
removeIconContainer: {
  position: 'absolute',
  top: 0,
  right: 0,
  width: 20,
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: 10,
},
removeIcon: {
  color: 'black',
  fontSize: 10,
  fontWeight:'bold'
},
middleContent: {
  flex: 1,  // Ensure the content takes up all available space within the middleSection
  justifyContent: 'center', // Align content vertically centered
  alignItems: 'center', // Align content horizontally centered
},
});

export default StyleScreen;