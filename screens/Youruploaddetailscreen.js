import { StyleSheet, Text, View, Button, TouchableOpacity, Image, ImageBackground } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc,getDoc } from 'firebase/firestore';
import { Timestamp, addDoc, collection, onSnapshot, query } from 'firebase/firestore';
import { auth } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import {  updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome';

const Youruploaddetailscreen = ({navigation, route}) => {
    const id = route.params;
    const [saveId, setId] = useState();
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [currentLikeState, setCurrentLikeState] = useState(true);

    const [ingrediants, setIngrediants] = useState({});
    

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
      const handleDelete = async () => {
        const colRef = collection(db, "saves"); 
        const colDoc = await getDocs(colRef);  
        colDoc.docs.forEach((doc) => {
        if(doc.data().postId==id){ 
           //setId(doc.id) 
           deleteDoc(doc(db,'saves',doc.id));
        }
    });
        //deleteDoc(doc(db,'saves',saveId));
        deleteDoc(doc(db, "posts", id));
        navigation.goBack();
      }

      const deletePost = () => {
        deleteDoc(doc(db, "posts", id));
        navigation.goBack();
      }
  const renderInner = () => (
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
          </View>
          <TouchableOpacity style={{flexDirection:'row',alignItems:'center', marginTop: 15}} onPress={()=>navigation.navigate('editPost', id)} >
                  <Icon name="pencil-square" size={22} color="#818181" />
                  <Text style={{marginLeft: 20}}>Edit Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection:'row',alignItems:'center', marginTop: 10}} onPress={handleDelete} >
            <Icon name="trash" size={26} color="#818181" />
            <Text style={{marginLeft: 20}}>Delete Post</Text>
          </TouchableOpacity>
        </View>
      );

  const bs = React.createRef();
  const fall = new Animated.Value(1);

  return (

    <View>
      <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}

        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
      <ImageBackground source={{uri: post.imageUrl}} resizeMode="cover" style={styles.backgroundImage} ></ImageBackground>
      
      <View style={{flexDirection: 'row', marginTop: 35, alignItems: 'center', justifyContent: 'center'}}> 
      
        <TouchableOpacity style={{marginRight: 270}}onPress={()=>{navigation.goBack()}}>
          <Icon name="chevron-circle-left" size={35} color="#F0F0F0" />
        </TouchableOpacity>

        
        <TouchableOpacity style={{ width: 30, marginTop: 10}}onPress={() => bs.current.snapTo(0)}>
          <Icon name="navicon" size={30} color="#fff" />
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

export default Youruploaddetailscreen

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
    panel: {
      marginTop: 25,
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
      borderRadius: 20,
      height: 200
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
})