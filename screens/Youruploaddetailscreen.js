import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc,getDoc } from 'firebase/firestore';
import { Timestamp, addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import {  updateDoc, getDocs, deleteDoc } from 'firebase/firestore';

const Youruploaddetailscreen = ({navigation, route}) => {
    const id = route.params;
    const [saveId, setId] = useState();
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [currentLikeState, setCurrentLikeState] = useState(true);

    //gets the 'posts' data and sub collection 'likes' data
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
          let data = await getDoc(docRef);
          setLikes(data.data().likesCount);
          setPost(data.data(), data.id);
          }
        });
      },[]);

      //to update the likes count when someone likes the post
      useEffect(()=> {
        if(liked == true){
          const docRef = doc(db,'posts',id);
          updateDoc(docRef,{
            likesCount: likes,
          });         
          setLiked(false)
        }
      }, [liked]);

      //to delete the subcollection document when someone unlikes the post 
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

    //logic to handle like and unlike 
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

      //delete post function 
      const handleDelete =async () => {
        const colRef = collection(db, "saves"); 
        const colDoc = await getDocs(colRef);  
        colDoc.docs.forEach((doc) => {
        if(doc.data().postId==id){ 
           setId(doc.id) 
        }
    });
        deleteDoc(doc(db,'saves',saveId));
        deleteDoc(doc(db, "posts", id));
        navigation.navigate('uploads');
      }

  return (

    <View>
      <Text>Youruploaddetailscreen</Text>
      <Image style={styles.image} source = {{uri: post.imageUrl}}/>
      <Text>Title: {post.title}</Text>
      <Text>Discription: {post.discription}</Text>
      <Text>Catagory: {post.catagory}</Text>
      <TouchableOpacity onPress={handleUpdateLike}>
        {currentLikeState?<Text>Not Liked</Text>:<Text>Liked</Text>}
        <Text>Likes: {likes}</Text>
      </TouchableOpacity>
      <Button title="Delete" onPress={handleDelete}/>
      <Button title="Edit Post" onPress={()=>navigation.navigate('editPost', id)}/>
    </View>
  )
}

export default Youruploaddetailscreen

const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
    }
})