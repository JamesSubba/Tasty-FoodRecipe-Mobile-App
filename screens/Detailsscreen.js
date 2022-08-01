import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ImageBackground, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc,getDoc } from 'firebase/firestore';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import {  updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Detailsscreen = ({navigation, route}) => {
    const id = route.params;
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [currentLikeState, setCurrentLikeState] = useState(true);
    const [ingrediants, setIngrediants] = useState({});

    const [isSaved, setIsSaved] = useState(false);

    useEffect(()=> {
      onAuthStateChanged(auth, async (user) => {
        if(currentLikeState==true){
        const docRef = doc(db, "posts", id);        
        const colRef = collection(docRef, "likes");
        const subColDoc = await getDocs(colRef);      
        subColDoc.docs.forEach((doc) => {
        if(doc.data().likedById==user.uid){
          setLiked(doc.data().liked);
          setCurrentLikeState(doc.data().currentLikeState); 
        }
    });
        const colRef2 = collection(docRef, "ingrediants");
        const subColDoc2 = await getDocs(colRef2);
        subColDoc2.docs.forEach((doc) => {
          setIngrediants({id: doc.id,...doc.data()});
      });
        let data = await getDoc(docRef);
        setLikes(data.data().likesCount);
        setPost(data.data(), data.id);
        }
      });
    },[]);

    useEffect(()=> {
        if(liked == true){
          const docRef = doc(db,'posts',id);
          updateDoc(docRef,{
            likesCount: likes,
          });         
          setLiked(false)
        }
      }, [liked]);

    const deleteDocument = async (uid) => {
        const docRef = doc(db, "posts", id);
        const colRef = collection(docRef, "likes");
        const subColDoc = await getDocs(colRef); 
        subColDoc.docs.forEach((doc) => {
          if(doc.data().likedById==uid){
          deleteDoc(doc.ref);
            }
      });
    }

    const handleUpdateLike = () => {
      setCurrentLikeState(!currentLikeState);
      currentLikeState==true?setLikes(likes+1):setLikes(likes-1);
      setLiked(true);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if(currentLikeState==true){
            const docRef = doc(db, "posts", id);
            const colRef = collection(docRef, "likes")
            addDoc(colRef, {
            likedBy: user.displayName,
            likedById: user.uid,
            liked: liked,
            currentLikeState: false,
            likedAt: Timestamp.now().toDate()
        });
          }
          if(currentLikeState==false) {
            deleteDocument(user.uid);
          }
        } 
      });
    }

    const savePost = () => {
      onAuthStateChanged(auth, (user) => {
          if (user) {
              setIsSaved(true);
              const collectionRef = collection(db, 'saves');
              addDoc(collectionRef, {
                  // title: post.title,
                  // CreatedBy: post.creatorName,
                  postId: id,
                  // linkesCount: likes,
                  savedBy: user.uid,
                  imageUrl: post.imageUrl,
                  savedAt: Timestamp.now().toDate()
              });
          }  
        });
  }
  
  return (
    <View>
      <ImageBackground source={{uri: post.imageUrl}} resizeMode="cover" style={styles.backgroundImage} ></ImageBackground>
      
      <View style={{flexDirection: 'row', marginTop: 35, alignItems: 'center', justifyContent: 'center'}}> 

        <TouchableOpacity style={{marginRight: 270}}onPress={()=>{navigation.goBack()}}>
                  <Icon name="chevron-circle-left" size={35} color="#F0F0F0" />
        </TouchableOpacity>

        <TouchableOpacity  onPress={savePost}>
          {isSaved?<Icon name="bookmark" size={35} color="#F0F0F0" />:<Icon name="bookmark-o" size={35} color="#F0F0F0" />}
        </TouchableOpacity>
        
      </View>
      
      <View style={{backgroundColor: '#fff', height: 500, width: 360, borderRadius: 20, marginTop: 200}}>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20, alignItems: 'center'}}>

          <View style={{marginRight: 90, alignItems: 'center'}}>
            <Icon name="th-large" size={24} color="#E56B6F" />
            <Text>{post.catagory}</Text>
          </View>

          <View style={{alignItems: 'center'}}>
            <Icon name="clock-o" size={26} color="#E56B6F" />
            <Text>{post.hour}</Text>
          </View>

          <View style={{marginLeft: 90, alignItems: 'center'}}>
            <TouchableOpacity onPress={handleUpdateLike} style={{alignItems:'center'}}>
              {currentLikeState?<Icon name="heart-o" size={24} color="#E56B6F" />:<Icon name="heart" size={24} color="#E56B6F" />}
              <Text>{likes} Likes</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginLeft: 30, marginTop: 20, marginRight: 20}}>
          <Text style={{fontSize: 25}}>{post.title}</Text>
          <Text style={{marginLeft: 10, fontSize: 12}}>created by: {post.creatorName}</Text>
          <Text style={{marginTop: 10}}>{post.discription}</Text>
          
          <Text style={{fontSize: 20, marginTop: 10}}>Ingrediants</Text>
          <View style={{marginLeft: 20, marginTop: 10}}>
            <Text>1. {ingrediants.ingrediant1}</Text>
            <Text>2. {ingrediants.ingrediant2}</Text>
            <Text>3. {ingrediants.ingrediant3}</Text>
            <Text>4. {ingrediants.ingrediant4}</Text>
            <Text>5. {ingrediants.ingrediant5}</Text>
          </View>
        </View>
        
      </View>
      
    </View>
  )
}

export default Detailsscreen

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
},
backgroundImage: {
  flex: 1,
  backgroundColor: "white",
  justifyContent: "center",
  width: 360,
  height: 300
},
})