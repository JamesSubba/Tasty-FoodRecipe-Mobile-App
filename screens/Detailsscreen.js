import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc,getDoc } from 'firebase/firestore';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import {  updateDoc, getDocs, deleteDoc } from 'firebase/firestore';

const Detailsscreen = ({navigation, route}) => {
    const id = route.params;
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [currentLikeState, setCurrentLikeState] = useState(true);
    const [ingrediants, setIngrediants] = useState({});

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
              const collectionRef = collection(db, 'saves');
              addDoc(collectionRef, {
                  title: post.title,
                  CreatedBy: post.creatorName,
                  postId: id,
                  savedBy: user.uid,
                  savedAt: Timestamp.now().toDate(),
              });
          }  
        });
  }
  
  return (
    <View>
      <Text>detailsscreen</Text>
      <Image style={styles.image} source = {{uri: post.imageUrl}}/>
      <Text>Title: {post.title}</Text>
      <Text>Discription: {post.discription}</Text>
      <Text>Catagory: {post.catagory}</Text>
      <Text>CreatedBy: {post.creatorName}</Text>
      <TouchableOpacity onPress={handleUpdateLike}>
        {currentLikeState?<Text>Not Liked</Text>:<Text>Liked</Text>}
        <Text>Likes: {likes}</Text>
      </TouchableOpacity>
      <Text>{ingrediants.ingrediant1}</Text>
      <Text>{ingrediants.ingrediant2}</Text>
      <Text>{ingrediants.ingrediant3}</Text>
      <Text>{ingrediants.ingrediant4}</Text>
      <Text>{ingrediants.ingrediant5}</Text>
      <Button title="save post" onPress={savePost}/>
      <Button title="goBack" onPress={()=>navigation.navigate('home')}/>
    </View>
  )
}

export default Detailsscreen

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
}
})