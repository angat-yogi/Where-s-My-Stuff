import { View, Text, StyleSheet, ScrollView, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Slider from "./Slider";
import GlobalApi from "../../API/GlobalApi";
import { useUser } from "@clerk/clerk-expo";
import { useSharedState } from "../../State/SharedStateProvider";

export default function HomeScreen({route}) {
  const [categories, setCategories] = useState();
  const [fashions, setFashions] = useState();
  const [storageTypes, setStorageTypes] = useState();
  const [rooms,setRooms]=useState([]);
  const { sharedState, setSharedState } = useSharedState();
  const { user, isLoading } = useUser();
  console.log("Shared State",sharedState)
const getRooms = () => {
  try{
  GlobalApi.getDefaultRooms().then(async (resp) => {
      const customizedRoomsForUser=resp?.rooms?.filter(r=>r.addedBy==='admin@wms.com'||r.addedBy===user?.emailAddresses[0].emailAddress)
      setRooms(customizedRoomsForUser)
  })
  }
  catch(error){
      console.error("Error fetching default furnitures:", error);
  };
};

  const getCategories = () => {
    GlobalApi.getCategories().then((resp) => {
      setCategories(resp?.categories);
    });
  };
  const getTrendingFashions = () => {
    GlobalApi.getTrendingFashions().then((resp) => {
      setFashions(resp?.trendingFashions);
    });
  };
  const getStorageTypes = () => {
    GlobalApi.getStorageTypes().then((resp) => {
      setStorageTypes(resp?.storageTypes);
    });
  };
  const [refreshing, setRefreshing] = useState(false);

  // Function to handle refresh action
  const onRefresh = () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  const sortedFashions = fashions?.sort((a, b) => b.noOfClicks - a.noOfClicks);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (isCloseToBottom({ layoutMeasurement, contentOffset, contentSize })) {
      onRefresh();
    }
  };
  useEffect(() => {
    getRooms();
    getCategories();
    getTrendingFashions();
    getStorageTypes();
  }, [route.params?.refresh]);
  return (
    <ScrollView onScroll={handleScroll}
    scrollEventThrottle={16} // Adjust scrollEventThrottle as needed
    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}contentContainerStyle={styles.scrollViewContent}
    showsVerticalScrollIndicator={false}
    >
      <Header icon="camera" action="Camera" />
      <View style={{ padding: 7 }}>
        <Slider
          isViewAll={true}
          displayHeading={true}
          heading="Categories For You"
          data={categories}
          styleImage={styles.imageCategory}
        />

        <Slider
          // isViewAll={false}
          plus={true}
          heading="Rooms"
          data={rooms}
          styleImage={styles.imageFashion}
        />
         <Slider
          isViewAll={false}
          displayHeading={true}
          heading="Pending Items"
          data={sharedState.pendingItems}
          styleImage={styles.imageFashion}
        />
                <Slider
          isViewAll={false}
          displayHeading={true}
          heading="Trending Fashions"
          data={sortedFashions}
          styleImage={styles.imageFashion}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imageCategory: {
    width: 220,
    height: 150,
    borderRadius: 20,
    objectFit: "fill",
  },
  imageFashion: {
    width: 220,
    height: 180,
    borderRadius: 20,
    objectFit: "fill",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
});
