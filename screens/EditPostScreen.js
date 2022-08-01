import { StyleSheet, Text, View,TextInput, Image, TouchableOpacity, ActivityIndicator, Button, KeyboardAvoidingView, ImageBackground, ScrollView, StatusBar } from 'react-native';
import React, {useEffect, useState} from 'react';
import { doc,getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase';
import DropDownPicker from 'react-native-dropdown-picker';
import { launchCameraAsync, launchImageLibraryAsync } from 'expo-image-picker';
import { getStorage } from "firebase/storage";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {v4} from 'uuid';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

const EditPostScreen = ({navigation, route}) => {
  const id = route.params;
  const [post, setPost] = useState({});
  const [newTitle, setNewTitle] = useState('')
  const [newDiscription, setNewDiscription] = useState('');
  const [newCatagory, setNewCatagory] = useState('');
  const [isNewImage, setIsNewImage] = useState(false);
  const [newImage, setNewImage] = useState()
  const [items, setItems] = useState([
    {label: 'Breakfast', value: 'Breakfast'},
    {label: 'Lunch', value: 'Lunch'},
    {label: 'Dinner', value: 'Dinner'}
  ]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [newingrediant1, setnewIngrediant1] = useState('');
  const [newingrediant2, setnewIngrediant2] = useState('');
  const [newingrediant3, setnewIngrediant3] = useState('');
  const [newingrediant4, setnewIngrediant4] = useState('');
  const [newingrediant5, setnewIngrediant5] = useState('');
  const [ingrediants, setIngrediants] = useState({});
  const [isLoading, setIsLoading] = useState(false);

    useEffect( ()=> {
      const getData = async () => {
        const docRef = doc(db, "posts", id);
        let data = await getDoc(docRef); 
        setPost(data.data());
        const colRef2 = collection(docRef, "ingrediants");
        const subColDoc2 = await getDocs(colRef2);
        subColDoc2.docs.forEach((doc) => {
          setIngrediants({id: doc.id,...doc.data()});
      });
      }
       getData();
    },[]);

    async function takeNewImageHandler(){
      const image = await launchCameraAsync({
          includeBase64: true,
          allowsEditing: true,
          aspect: [16,9],
          quality: 0.5,
      });
      setNewImage(image.uri);
      setIsNewImage(true);
  }

  async function openSystemPhotos(){
        
      const image = await launchImageLibraryAsync({
        includeBase64: true,
        allowsEditing: true,
        aspect: [16,9],
        quality: 0.5,
    });
    setNewImage(image.uri);
    setIsNewImage(true);
    }
  const uploadImg = async (uri,imagename) => {
    const img = await fetch(uri);
    const blob = await img.blob();
    const storage = getStorage();
    const imageRef = ref(storage, 'images/'+imagename+v4());
    uploadBytes(imageRef,blob).then((snapshot)=>{
      getDownloadURL(snapshot.ref).then((url)=>{
        const docRef = doc(db,'posts',id);
        updateDoc(docRef,{
          title: newTitle,
          discription: newDiscription,
          imageUrl: url,
          catagory: newCatagory,
        });
        const subcoldocRef = doc(db,'posts',id,'ingrediants', ingrediants.id);
        updateDoc(subcoldocRef, {
          ingrediant1: newingrediant1,
          ingrediant2: newingrediant2,
          ingrediant3: newingrediant3,
          ingrediant4: newingrediant4,
          ingrediant5: newingrediant5
        })
      //   const colRef = collection(docRef, "ingrediants");
      //   const subColDoc = await getDocs(colRef); 
      //   subColDoc.docs.forEach((doc) => {
      //     if(doc.id==ingrediants.id){
      //       updateDoc(docRef,{
      //         title: newTitle,
      //         discription: newDiscription,
      //         imageUrl: url,
      //         catagory: newCatagory,
      //       });
      //       }
      // });
        navigation.replace('uploadDetail',id);
      })
    })
  }


  const upload = () => {
          onAuthStateChanged(auth, (user) => {
              if (user) {
                    setIsLoading(!isLoading);
                    uploadImg(newImage, "Img",user.uid);
              } 
            });
        }  

        const renderInner = () => (
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <View style={styles.panelHandle} />
            </View>
            <TouchableOpacity style={{flexDirection:'row',alignItems:'center', marginTop: 10}} onPress={takeNewImageHandler} >
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
              
              <Text style={{color: "#FFF", fontSize: 30, fontWeight: 'bold'}}>Edit Post</Text>
              <Text style={{color: "#FFF", fontSize: 10, fontStyle: 'italic'}}>'make changed to your post'</Text>

              <View style={styles.containerb}>

              <Text style={{fontSize: 14, color: '#A09F9F', fontWeight: 'bold', marginLeft: 20, marginBottom: 8, marginRight: 240}}>Details</Text>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                <TextInput  defaultValue={post.title} onChangeText={(text)=>setNewDiscription(text)} style={styles.input} />
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                <TextInput  defaultValue={post.hour} onChangeText={(text)=>setNewDiscription(text)} style={styles.input} />
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                <TextInput  defaultValue={post.discription} onChangeText={(text)=>setNewDiscription(text)} style={styles.input} multiline={true}/>
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
                        setNewCatagory(value)
                      }}
                      style={{width: 285, height:53, marginBottom: 20}} 
                  />
               <Text style={{fontSize: 14, color: '#A09F9F', fontWeight: 'bold', marginLeft: 20, marginBottom: 8, marginRight: 210}}>Ingrediants</Text>
                  
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput defaultValue={ingrediants.ingrediant1} onChangeText={(text)=>setnewIngrediant1(text)} style={styles.input}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput defaultValue={ingrediants.ingrediant2} onChangeText={(text)=>setnewIngrediant2(text)} style={styles.input}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput defaultValue={ingrediants.ingrediant3} onChangeText={(text)=>setnewIngrediant3(text)} style={styles.input}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput defaultValue={ingrediants.ingrediant4} onChangeText={(text)=>setnewIngrediant4(text)} style={styles.input}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center', borderColor: 'black', borderWidth: 1,width:'88%',borderRadius:8,height:53,paddingLeft:20, marginBottom: 20}}>
                  <TextInput defaultValue={ingrediants.ingrediant5} onChangeText={(text)=>setnewIngrediant5(text)} style={styles.input}/>
              </View>
              <BottomSheet
                ref={bs}
                snapPoints={[350, 0]}
                renderContent={renderInner}

                initialSnap={1}
                callbackNode={fall}
                enabledGestureInteraction={true}
              />
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                    {isNewImage?<Image style={styles.image} source = {{uri: newImage}}/>:<Image style={styles.image} source = {{uri: post.imageUrl}}/>}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => bs.current.snapTo(0)} > 
                  <View style={{borderColor: 'black', borderWidth: 1, borderRadius: 8, paddingHorizontal: 98, paddingVertical: 16 }}>
                    <Text>Change Image</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.appButtonContainer} onPress={upload} >
                  {isLoading && <ActivityIndicator size={15} color="#fff" />}
                  <Text style={styles.appButtonText}>Save Changes</Text>
                </TouchableOpacity>
                  
              </View>
      
    </View>
    </ImageBackground>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default EditPostScreen

const styles = StyleSheet.create({
  image: {
    width:250,
  height: 250,
  borderRadius: 9,
    marginTop: 5,
     marginBottom: 20
}, 
backgroundImage: {
  flex: 1,
  backgroundColor: "white",
  justifyContent: "center",
  width: 360,
  height: 1350
},
container: {
  flex: 1,
  alignItems: 'center',
  flexDirection:'column',
  paddingTop:30,
  paddingHorizontal:'3%',
  marginBottom: 10
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