import { StyleSheet, Text, View, TextInput, Button, Image } from 'react-native'
import React, { useState } from 'react';
import { db } from '../firebase';
import { Timestamp, addDoc, collection, getDocs, doc } from 'firebase/firestore';
import { auth } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4} from 'uuid';
import { onAuthStateChanged } from "firebase/auth";
import DropDownPicker from 'react-native-dropdown-picker';
import { launchCameraAsync, useCameraPermissions, PermissionStatus,requestMediaLibraryPermissionsAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { getStorage } from "firebase/storage";

const Postscreen = ({navigation}) => {
    const [pickedImage, setPickedImage] = useState();
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [title, setTitle] = useState('');
    const [discription, setDiscription] = useState('');
    const [catagory, setCatagory] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [liksCount, setlikesCount] = useState(0);
    const [items, setItems] = useState([
        {label: 'Breakfast', value: 'Breakfast'},
        {label: 'Lunch', value: 'Lunch'},
        {label: 'Dinner', value: 'Dinner'}
      ]);
    const [ingrediant1, setIngrediant1] = useState('');
    const [ingrediant2, setIngrediant2] = useState('');
    const [ingrediant3, setIngrediant3] = useState('');
    const [ingrediant4, setIngrediant4] = useState('');
    const [ingrediant5, setIngrediant5] = useState('');
    
    async function verifyPermission(){
        if(cameraPermissionInformation.status === PermissionStatus.UNDETERMINED){
            const permissionResponse = await requestPermission();

            return permissionResponse.granted;
        }
        if(cameraPermissionInformation.status === PermissionStatus.DENIED){
            Alert.alert(
                'Insufficient Permission!',
                'You need to grant camera permission to use this app.'
            );
            return false;
        }
        return true;
        }  

      async function takeImageHandler(){
          const hasPermission = await verifyPermission();
          if (!hasPermission){
              return;
          }
      }
      async function openSystemPhotos(){
        
      const permissionResult = await requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("You've refused to allow this appp to access your photos!");
        return;
      }
        const image = await launchImageLibraryAsync({
          includeBase64: true,
          allowsEditing: true,
          aspect: [16,9],
          quality: 0.5,
      });
      setPickedImage(image.uri);
      }

      async function takeImageHandler(){
          const image = await launchCameraAsync({
              includeBase64: true,
              allowsEditing: true,
              aspect: [16,9],
              quality: 0.5,
          });
          setPickedImage(image.uri);
      }
      let imagePreview = <Text> No Image taken yet</Text>

      if(pickedImage){
          imagePreview = <Image style={styles.image} source = {{uri: pickedImage}}/>;
      }

      const uploadImg = async (uri,imagename,id,name) => {
        const img = await fetch(uri);
        const blob = await img.blob();
        const storage = getStorage();
        const imageRef = ref(storage, 'images/'+imagename+v4());
        uploadBytes(imageRef,blob).then((snapshot)=>{
          getDownloadURL(snapshot.ref).then((url)=>{
            const collectionRef = collection(db, 'posts');
              addDoc(collectionRef, {
                title: title, 
                discription: discription,
                catagory: catagory,
                likesCount: liksCount,
                imageUrl: url,
                createdAt: Timestamp.now().toDate(),
                creatorName: name,
                creatorUID: id
              });
              uploadIngrediant(url);
          })
        })
      }

      const uploadIngrediant = async (URL) => {
        const collectionRef = collection(db, 'posts');
        const colDoc = await getDocs(collectionRef); 
        colDoc.docs.forEach((doc) => {
          if(doc.data().imageUrl==URL){
            uploadIngrediant2(doc.id);
            }
      });
      }

      const uploadIngrediant2 = (id) => {
        const docRef = doc(db, "posts", id);
        const colRef = collection(docRef, "ingrediants");
        addDoc(colRef, {
          ingrediant1: ingrediant1,
          ingrediant2: ingrediant2,
          ingrediant3: ingrediant3,
          ingrediant4: ingrediant4,
          ingrediant5: ingrediant5
      });
      }

      const upload = () => {
          if(title == '' && discription == '') {
              console.log('please enter some value');
              return;
          }
          else {
              onAuthStateChanged(auth, (user) => {
                  if (user) {
                        uploadImg(pickedImage, "Img",user.uid, user.displayName);
                    navigation.navigate('home');
                  } 
                });
              }
            }

  return (
    <View>
        <Text>postscreen</Text>
        <TextInput placeholder="title" onChangeText={(text)=>setTitle(text)}/>
        <TextInput placeholder="discription" onChangeText={(text)=>setDiscription(text)}/>
        <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        mode="BADGE"
        disableBorderRadius={true}
        onChangeValue={(value) => {
            setCatagory(value)
          }}
      />
      <View>{imagePreview}</View>
      <Button title="takepicture" onPress={takeImageHandler}> Take Image</Button>
      <Button title="upload photos" onPress={openSystemPhotos}/>
      <TextInput placeholder='ingrediant1' onChangeText={(text)=>{setIngrediant1(text)}}/>
      <TextInput placeholder='ingrediant2' onChangeText={(text)=>{setIngrediant2(text)}}/>
      <TextInput placeholder='ingrediant3' onChangeText={(text)=>{setIngrediant3(text)}}/>
      <TextInput placeholder='ingrediant4' onChangeText={(text)=>{setIngrediant4(text)}}/>
      <TextInput placeholder='ingrediant5' onChangeText={(text)=>{setIngrediant5(text)}}/>
      <Button title="upload" onPress={upload}/>
    </View>
  )
}

export default Postscreen

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
}
})