import { AutoFocus, Camera, CameraType } from 'expo-camera';
import { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GlobalApi from "../../API/GlobalApi";
import { useUser } from "@clerk/clerk-expo";
import * as FileSystem from 'expo-file-system';
import BackgroundAdjustmentScreen from './BackgroundAdjustmentScreen';
import * as ImagePicker from "expo-image-picker";

export default function CameraComponent() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const cameraRef = useRef(null);
  const[image,setImage]=useState();
  const { user, isLoading } = useUser();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }
  const addPhoto = (values) => {
    const data = {
      userId: user?.emailAddresses[0]?.emailAddress,
      image:{url: uri},
    };

    GlobalApi.addToDos(data).then((resp) => {
      ToastAndroid.show("To Do added successfully", ToastAndroid.LONG);
    });
  };
  
let data=null;
  // const takePicture = async () => {
  //   if (cameraRef.current) {
  //     try {
  //       const options = { quality: 0.5, skipProcessing: false };
  //       const imagedata = await cameraRef.current.takePictureAsync(options);
  //       console.log("imageData: ",imagedata)
        
  //       const base64Image = await FileSystem.readAsStringAsync(imagedata.uri, { encoding: FileSystem.EncodingType.Base64 });

  //       // Handle the captured picture URI
  //       const source = imagedata?.uri;
  //       if (source) {
  //        await cameraRef.current.pausePreview();
  //            }
  //        data = {
  //         userId: user?.emailAddresses[0]?.emailAddress,
  //         image:{url: imagedata.uri},
  //       };
    
  //       GlobalApi.addclosetContents(data).then((resp) => {
  //         // ToastAndroid.show("Photo added successfully", ToastAndroid.LONG);
  //         Alert.alert('Success', 'Photo added successfully', [{ text: 'OK', onPress: () => console.log('OK Pressed') }]);

  //       });
  //     } catch (error) {
  //       console.error('Error taking picture:', error);
  //     }
  //   }
  // };

  const takePicture=async()=>{
    try {
      let result= await ImagePicker.launchCameraAsync({
        cameraType:ImagePicker.CameraType.back,
        allowsEditing:true,
        aspect:[4,3],
        quality:1
      });
      if (!result.cancelled) {
        setImage( result.assets[0].uri);
      }
      else{
        console.log("could not load image")
      }
    } catch (error) {
      Alert.alert('Error saving the picture: '+error)
    }
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permissions to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      </Camera>
      <BackgroundAdjustmentScreen imageUri={data?.image?.uri} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
