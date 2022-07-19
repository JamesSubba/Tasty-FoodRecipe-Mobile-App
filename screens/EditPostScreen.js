import { StyleSheet, Text, View,TextInput, Image, TouchableOpacity, Button } from 'react-native';
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
                    uploadImg(newImage, "Img",user.uid);
              } 
            });
        }  

  return (
    <View>
      <Text>EditPostScreen</Text>
      <Text>{post.title}</Text>
      <TextInput  defaultValue={post.title} onChangeText={(text)=>setNewTitle(text)}/>
      <TextInput  defaultValue={post.discription} onChangeText={(text)=>setNewDiscription(text)}/>
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
      />
      <TouchableOpacity onPress={takeNewImageHandler}>
        {isNewImage?<Image style={styles.image} source = {{uri: newImage}}/>:<Image style={styles.image} source = {{uri: post.imageUrl}}/>}
      </TouchableOpacity>
      <Button title="select" onPress={openSystemPhotos}/>
      
      <TextInput defaultValue={ingrediants.ingrediant1} onChangeText={(text)=>setnewIngrediant1(text)}/>
      <TextInput defaultValue={ingrediants.ingrediant2} onChangeText={(text)=>setnewIngrediant2(text)}/>
      <TextInput defaultValue={ingrediants.ingrediant3} onChangeText={(text)=>setnewIngrediant3(text)}/>
      <TextInput defaultValue={ingrediants.ingrediant4} onChangeText={(text)=>setnewIngrediant4(text)}/>
      <TextInput defaultValue={ingrediants.ingrediant5} onChangeText={(text)=>setnewIngrediant5(text)}/>

      <Button title='update' onPress={upload}/>
    </View>
  )
}

export default EditPostScreen

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
}
})