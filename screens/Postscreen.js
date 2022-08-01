import { StyleSheet,TouchableOpacity, Text, View,StatusBar, ActivityIndicator,TextInput,ScrollView, Button, Image , KeyboardAvoidingView, ImageBackground} from 'react-native'
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
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

const Postscreen = ({navigation}) => {
    const [pickedImage, setPickedImage] = useState();
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [title, setTitle] = useState('');
    const [hour, setHour] = useState('');
    const [discription, setDiscription] = useState('');
    const [catagory, setCatagory] = useState('');
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [liksCount, setlikesCount] = useState(0);
    const [items, setItems] = useState([
        {label: 'Breakfast', value: 'Breakfast'},
        {label: 'Lunch', value: 'Lunch'},
        {label: 'Dinner', value: 'Dinner'},
        {label: 'Snacks', value: 'Snacks'}
      ]);
    const [ingrediant1, setIngrediant1] = useState('');
    const [ingrediant2, setIngrediant2] = useState('');
    const [ingrediant3, setIngrediant3] = useState('');
    const [ingrediant4, setIngrediant4] = useState('');
    const [ingrediant5, setIngrediant5] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
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
          aspect: [16,16],
          quality: 0.5,
      });
      setPickedImage(image.uri);
      }

      async function takeImageHandler(){
          const image = await launchCameraAsync({
              includeBase64: true,
              allowsEditing: true,
              aspect: [16,16],
              quality: 0.5,
          });
          setPickedImage(image.uri);
      }
      let imagePreview = <Image style={styles.image} source = {require('../assets/image3.jpg')}/>;

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
                hour: hour,
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
                    setIsLoading(!isLoading);
                    uploadImg(pickedImage, "Img",user.uid, user.displayName);
                    
                    navigation.goBack();
                  } 
                });
              }
            }

      const renderInner = () => (
              <View style={styles.panel}>
                <View style={styles.panelHeader}>
                  <View style={styles.panelHandle} />
                </View>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center', marginTop: 10}} onPress={takeImageHandler} >
                  <Icon name="camera" size={19} color="#818181" />
                  <Text style={{marginLeft: 20}}>Open Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flexDirection:'row',alignItems:'center', marginTop: 15}} onPress={openSystemPhotos} >
                  <Icon name="folder" size={22} color="#818181" />
                  <Text style={{marginLeft: 20}}>Select from Gallery</Text>
                </TouchableOpacity>
              </View>
            );

      const bs = React.createRef();
      const fall = new Animated.Value(1);

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff'}}   >
        <ScrollView>
          <ImageBackground source={require('../assets/BackgroundImages/Post5.png')} resizeMode="cover" style={styles.backgroundImage} >
            <StatusBar translucent backgroundColor="transparent" />

            <View style={styles.container}>

              <TouchableOpacity style={{marginRight: 300}}onPress={()=>{navigation.goBack()}}>
                <Icon name="chevron-circle-left" size={35} color="#F0F0F0" />
              </TouchableOpacity>
              
              <Text style={{color: "#FFF", fontSize: 30, fontWeight: 'bold'}}>Create Post</Text>
              <Text style={{color: "#FFF", fontSize: 10, fontStyle: 'italic'}}>'share your recipes to the world'</Text>
              
              <View style={styles.containerb}>
                <Text style={{fontSize: 14, color: '#A09F9F', fontWeight: 'bold', marginLeft: 20, marginBottom: 8, marginRight: 240}}>Details</Text>
                
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder="Title" onChangeText={(text)=>setTitle(text)} style={styles.input}/>
                </View>

                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder="Time" onChangeText={(text)=>setHour(text)} style={styles.input}/>
                </View>

                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder="Discription" onChangeText={(text)=>setDiscription(text)} style={styles.input}  multiline={true}/>
                </View>
                
                <Text style={{fontSize: 14, color: '#A09F9F', fontWeight: 'bold', marginLeft: 20, marginBottom: 8, marginRight: 225}}>Category</Text>
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
                style={{width: 285, height:53, marginBottom: 20}}
              />
              <Text style={{fontSize: 14, color: '#A09F9F', fontWeight: 'bold', marginLeft: 20, marginBottom: 8, marginRight: 210}}>Ingrediants</Text>
              
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder='ingrediant1' onChangeText={(text)=>{setIngrediant1(text)}} style={styles.input}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder='ingrediant2' onChangeText={(text)=>{setIngrediant2(text)}} style={styles.input}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder='ingrediant3' onChangeText={(text)=>{setIngrediant3(text)}} style={styles.input}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder='ingrediant4' onChangeText={(text)=>{setIngrediant4(text)}} style={styles.input}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput placeholder='ingrediant5' onChangeText={(text)=>{setIngrediant5(text)}} style={styles.input}/>
                </View>
                <BottomSheet
                ref={bs}
                snapPoints={[350, 0]}
                renderContent={renderInner}

                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={true}
              />
              <Text style={{fontSize: 14, color: '#A09F9F', fontWeight: 'bold', marginLeft: 20, marginBottom: 8, marginRight: 235}}>Image</Text>
              
              <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                <View style={{marginTop: 5, marginBottom: 20}}>{imagePreview}</View>
              </TouchableOpacity>
              
                <TouchableOpacity onPress={() => bs.current.snapTo(0)} > 
                  <View style={{borderColor: 'black', borderWidth: 1, borderRadius: 8, paddingHorizontal: 98, paddingVertical: 16 }}>
                    <Text>Upload Image</Text>
                  </View>
                </TouchableOpacity>

              
                <TouchableOpacity style={styles.appButtonContainer} onPress={upload} >
                  {isLoading && <ActivityIndicator size={15} color="#fff" />}
                  <Text style={styles.appButtonText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
        </ImageBackground>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Postscreen

const styles = StyleSheet.create({
image: {
  width:250,
  height: 250,
  borderRadius: 9
},
container: {
  flex: 1,
  alignItems: 'center',
  flexDirection:'column',
  paddingTop:30,
  paddingHorizontal:'3%',
  marginBottom: 10
},
backgroundImage: {
  flex: 1,
  backgroundColor: "white",
  justifyContent: "center",
  width: 360,
  height: 1350
},
containerb: {
  marginTop: 35,
  flex: 1,
  alignItems: 'center'
},
input:{
  position:'relative',
  height:'100%',
  width:'90%'
},
panel: {
  marginTop: 240,
  padding: 20,
  backgroundColor: '#FFFFFF',
  paddingTop: 20,
  borderRadius: 20,
  height: 160
},
panelHeader: {
  alignItems: 'center'
},
panelHandle: {
  width: 60,
  height: 5,
  borderRadius: 4,
  backgroundColor: '#00000040',
  marginBottom: 10,
},
panelTitle: {
  fontSize: 27,
  height: 35,
},
panelSubtitle: {
  fontSize: 14,
  color: 'gray',
  height: 30,
  marginBottom: 10,
},
panelButton: {
  padding: 13,
  borderRadius: 10,
  backgroundColor: '#FF6347',
  alignItems: 'center',
  marginVertical: 7,
},
panelButtonTitle: {
  fontSize: 17,
  fontWeight: 'bold',
  color: 'white',
},
appButtonContainer: {
  flexDirection: 'row',
  elevation: 3,
  backgroundColor: "#E56B6F",
  borderRadius: 30,
  paddingVertical: 15,
  width: 285,
  marginBottom: 10,
  marginTop: 20, 
  justifyContent: 'center'
   
},
appButtonText: {
  fontSize: 16,
  color: "#fff",
  fontWeight: "bold"  }
})