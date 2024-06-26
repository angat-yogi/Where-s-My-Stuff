import { request, gql, GraphQLClient } from "graphql-request";
import { Alert } from "react-native";


const URL =
  "https://api-us-west-2.hygraph.com/v2/clspbrpww0ftj01w713oecr6o/master";
const graphQLClient = new GraphQLClient(URL, {
  headers: {
    authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MDgyMDkyMjAsImF1ZCI6WyJodHRwczovL2FwaS11cy13ZXN0LTIuaHlncmFwaC5jb20vdjIvY2xzcGJycHd3MGZ0ajAxdzcxM29lY3I2by9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC11cy13ZXN0LTIuaHlncmFwaC5jb20vIiwic3ViIjoiZjY5YTk2NjgtNmJkZC00NzRiLWJiNzAtODYyMzA4NzUwNWE1IiwianRpIjoiY2xzcW5ueTExMGFldTAxbjVnZzJ0Mm44MyJ9.kYgGs1UpRYp0PwJ4_dic6JIZXnr8TxHLKjFilz78OC2eiiBhbwPR6OUzPjRq4v7WSSjrqzVBYSuOSbFIIr9XSAhnky3CE04CeakL79BPovHEi8UedDWXKxcnkKVLryJLkfAAPxLOypBzeWZC9m-Brw6DLRXLS4sxjr1nLxjGfggN4X0_WxT7o3t0F3GVhUZKnsFKGr-S-flOtrgGBmXVJnNRuv2bsICBB0YB4HCvC0zdz6eTeFpSpCxL8ujVTc5spA5o-U-2zIGfUUXrSAhgciiwCT1_EIjcI5jxXWrhvup2nPW8fbnW64-bBgeADdz8S6y88P71vtbTcFna-V4EYqgFRjIOtYtvkzRH4MMq6q6FR6xOiiRDFu8ty5kinqrAHwKZdsIICtgVbJWDRqHOiCHEJxwV7EChGZaPER5aSBUzOkRgBXyL0fFW4U-hbeAMqptsL3t_GEaKj8Eg98p9qHzVpeIw3P2xgELtCB32PAjrlmNObvBt0gbPPXNE68yirWFbO71_pb_KAyZk_bfC_NurP21-HSvsDch7yDiK859AVsARkw8CzxpJusNpiM8H4ymaVH71WfJ2-Dg8H09a3TuPYsTk_bZTaI3om4ZkFNvOUIYVcAJGHRRr1SnxMI3gumx3DSObEVfoloMbPVqrSBjOoO00sn-crg_pwAHCTFc`,
  },
});

const getClosetsContents = async () => {
  let result;
  const query = gql`
  query GetClosetsContents {
    userStorages {
      imageUri
      userEmail
    }
  }
  `;

  try {
    result = await graphQLClient.request(query);

  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};

const getCategories = async () => {
  let result;
  const query = gql`
    query GetCategories {
      categories {
        id
        name
        displayImage {
          url
        }
      }
    }
  `;

  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};
const addToDos = async (data) => {
  let result;
  const isoDueDate = new Date(data.dueDate).toISOString();

  const mutationQuery = gql`
    mutation createToDo {
      createToDo(
        data: { 
          userId: "${data.userId}", 
          description: "${data.description}", 
          dueDate: "${isoDueDate}", 
          category: Upcoming 
        }
      ){
        id
        description
        dueDate
        category
      }
      publishManyToDos {
        count
      }
    }
  `;

  try {
    result = await request(URL, mutationQuery);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};

const addclosetContents = async (data) => {

  let result;

  const mutationQuery = gql`
  mutation createUserStorage {
    createUserStorage(
      data: {
        userEmail: "${data.userId}",
        imageUri:"${data.imageUrl}",
      }
    ) {
      id
    }
    publishManyUserStorages {
      count
    }
  }
  `;
try {
  result = await request(URL, mutationQuery);
  Alert.alert('Success', 'Successfull, Closing the closet', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
} catch (error) {
  console.error("error on api:", error);
  Alert.alert('Error', 'Closing the closet anyway', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);

}
return result;
};



const addUserRoom = async (data) => {

  let result;

  const mutationQuery = gql`
  mutation AddUserRoom {
    createUserRoom(data: {roomName: "${data.roomName}", email: "${data.email}", imageOfRoom: "${data.uri}"})
    {
      id
    }
    publishManyUserRooms {
      count
    }
  }

  `;
try {
  result = await request(URL, mutationQuery);
  Alert.alert('Success', 'Successfully organized closet', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
} catch (error) {
  console.error("error on api:", error);
  Alert.alert('Error', 'Unsuccessful in organizing closet', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);

}
return result;
};

const addItemCoordinates = async (data) => {

  let result;

  const mutationQuery = gql`
  mutation InputItemCoordinates {
    createUserStorageItemCoordinate(
      data: {imageUri: "${data.uri}", 
      userEmail: "${data.email}",
       xCoordinate: ${data.X}, 
       yCoordinate: ${data.Y}}
    ){
      id
    }
    publishManyUserStorageItemCoordinates {
      count
    }
  }
  `;
try {
  result = await request(URL, mutationQuery);
  Alert.alert('Success', 'Successfully organized closet', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);
} catch (error) {
  console.error("error on api:", error);
  Alert.alert('Error', 'Unsuccessful in organizing closet', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);

}
return result;
};

//UserRooms


const addUserInitialOldRooms = async (data) => {
  let result;

  const mutationQuery = gql`
  mutation AddUserNewRooms {
    createUserRoom(
      data: {
        userEmail: "${data.email}", 
        rooms: {
          connect: {
            roomDisplayName: "${data.room.roomDisplayName}", 
      }
    }
  }
    ) {
      id
    }
    publishManyUserRooms{
      count
    }
  }
  
  `;
try {
  result = await request(URL, mutationQuery);
} catch (error) {
  console.error("error on api:", error);

}
return result;
};

const addUserInitialNewRooms = async (data) => {

  let result;

  const mutationQuery = gql`
  mutation AddUserNewRooms {
    createUserRoom(
      data: {
        userEmail: "${data.email}", 
        rooms: {
          create: {
            imageUri: "${data.room.imageUri}", 
            roomDisplayName: "${data.room.roomDisplayName}", 
            roomType: ${data.room.roomType.trim('"')}, 
            addedBy: "${data.email}"
      }
    }
  }
    ) {
      id
    }
    publishManyRooms{
      count
    }
    publishManyUserRooms{
      count
    }
  }
  
  `;
try {
  result = await request(URL, mutationQuery);
} catch (error) {
  console.error("error on api:", error);

}
return result;
};

//UserFurnituresByRoom
const addUserInitialOldFurnitures = async (data) => {
  let result;

  const mutationQuery = gql`
  mutation SaveUserRoomsWithExistingFurnitures {
    createUserFurniture(
      data: {userEmail: "${data.email}", 
      room: "${data.room}", 
      furnitures: {
        connect: {
          name: "${data.furniture.name}", 
        }}}
    ) {
      id
    }
  }
  
  `;
try {
  result = await request(URL, mutationQuery);
} catch (error) {
  console.error("error on api:", error);

}
return result;
};



const addItemToFurniture =async (data)=>{
  let result;

  const mutationQuery = gql`
  mutation AddItemToFurniture {
    createFurnitureItem(
      data: {
        userEmail: "${data.email}", 
        name: "${data.name}", 
        image: "${data.image}", 
        room: "${data.room}", 
        furniture: "${data.furniture}", 
        brand: "${data.brand}", 
        size: ${data.size}
      })
      {
        id
      }
      publishManyFurnitureItems{
        count
      }
  }


  `;
try {
  result = await request(URL, mutationQuery);
} catch (error) {
  console.error("error on api:", error);

}
return result;
};



const addFurniture =async (data)=>{
  let result;

  const mutationQuery = gql`
  mutation AddNewFurniture {
    createFurniture(data: 
      {
        name: "${data.name}", 
        image: "${data.image}",
        email:"${data.email}"
      })
    {
      
  id
    }
    publishManyFurnitures{
      count
    }
  }
  `;
try {
  result = await request(URL, mutationQuery);
} catch (error) {
  console.error("error on api:", error);

}
return result;
};

const addUserInitialNewFurnitures = async (data) => {

  let result;

  const mutationQuery = gql`
  mutation SaveUserRoomsWithNewFurnitures {
    createUserFurniture(
      data: {userEmail: "${data.email}", 
      room: "${data.room}", 
      furnitures: {
        create: {
          name: "${data.furniture.name}", 
          image: "${data.furniture.image}"
          email:"${data.furniture.email}"
        }
      }
    }
    ) {
      id
    }
  }
  
  `;
try {
  result = await request(URL, mutationQuery);
} catch (error) {
  console.error("error on api:", error);

}
return result;
};

const publishUserFurnitures = async () => {

  let result;

  const mutationQuery = gql`
  mutation PublishUserFurnitures {
    publishManyUserFurnitures {
      count
    }
  }
  `;
try {
  result = await request(URL, mutationQuery);
  if(result.publishManyUserFurnitures.count>0){
  }
} catch (error) {
  console.error("error on api:", error);
}
return result;
};

const publishFurnitures = async () => {

  let result;

  const mutationQuery = gql`
  mutation publishManyFurnitures {
    publishManyFurnitures {
      count
    }
  }
  `;
try {
  result = await request(URL, mutationQuery);
  if(result.publishManyFurnitures.count>0){
  }
} catch (error) {
  console.error("error on api:", error);
}
return result;
};




const getRoomFurnitureItems = async (data) => {
  let result;
  const query = gql`
  query GetFurnitureItemImage {
    furnitureItems(
      where: { 
      furniture_contains: "${data.furniture}", 
      room: "${data.room}", 
      userEmail: "${data.email}"}
    ) {
      brand
      furniture
      id
      image
      name
      room
      size
      userEmail
      updatedAt
    }
  }
  
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};



const GetAllUserFurnitureItems = async (data) => {
  let result;
  const query = gql`
  query GetAllFurnitureItems {
    furnitureItems(where: {userEmail: "${data.email}"},, last: 50) {
      id
      furniture
      name
      image
      room
    }
  } 
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};

const getUserFurnitures = async () => {
  let result;
  const query = gql`
  query GetUserFurnitures {
    userFurnitures(last:100) {
      userEmail
      room
      furnitures(last: 100) {
        email
        image
        name
        id
        room
      }
    }
  }
  
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};

const getDefaultFurnitures = async () => {
  let result;
  const query = gql`
  query GetDefaultFurnitures {
    furnitures(last: 100) {
      image
      name
      id
      room
      email
    }
  }
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};


const getDefaultRooms = async () => {
  let result;
  const query = gql`
  query GetDefaultRooms {
    rooms(last:100) {
      id
      imageUri
      roomDisplayName
      roomType
      addedBy
    }
  }
  
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};


const getTrendingFashions = async () => {
  let result;
  const query = gql`
    query GetTrendingFashions {
      trendingFashions {
        id
        name
        noOfClicks
        image {
          url
        }
      }
    }
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};
const getStorageTypes = async () => {
  let result;
  const query = gql`
    query GetStorageTypes {
      storageTypes {
        storageTypeName
        id
        image {
          url
        }
      }
    }
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};

const getItemsStorageCoordinates = async () => {
  let result;
  const query = gql`
  query getItemsStorageCoordinates {
    userStorageItemCoordinates {
      imageUri
      xCoordinate
      yCoordinate
      userEmail
    }
  }
  
  `;
  try {
    result = await graphQLClient.request(query);
  } catch (error) {
    console.error("error on api:", error);
  }
  return result;
};

export default {
  getCategories,
  getTrendingFashions,
  getStorageTypes,
  addToDos,
  addclosetContents,
  getClosetsContents,
  addItemCoordinates,
  getItemsStorageCoordinates,
  addUserRoom,
  getDefaultFurnitures,
  addUserInitialOldFurnitures,
  publishFurnitures,
  publishUserFurnitures,
  addUserInitialNewFurnitures,
  getDefaultRooms,
  addUserInitialOldRooms,
  addUserInitialNewRooms,
  getUserFurnitures,
  addFurniture,
  addItemToFurniture,
  getRoomFurnitureItems,
  GetAllUserFurnitureItems
};
