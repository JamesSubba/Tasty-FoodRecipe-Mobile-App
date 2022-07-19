import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import { db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

const Youruploadscreen = ({navigation}) => {
    const [posts, setPosts] = useState([]);
    const [uid, setUid] = useState('')

    useEffect(()=> {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;     
                setUid(uid);
            } 
          });
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef, orderBy('createdAt','desc'));
        onSnapshot(q, (snapshot)=> {
        const data = snapshot.docs.map((doc)=> ({
            id: doc.id,
            ...doc.data()
        }))
        setPosts(data);
        })
    },[]);
    
  return (
    <View>
      <Text>youruploadscreen</Text>
      <Button title="goBack" onPress={()=>navigation.navigate('profile')} />
      <FlatList
        data={posts}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
            uid===item.creatorUID?(
                <TouchableOpacity onPress={()=>navigation.navigate('uploadDetail',item.id)}>
                  <Text>Title: {item.title}</Text>
                  <Text>Discription: {item.discription}</Text>
                  <Text>CreatedBy: {item.creatorName}</Text>
                </TouchableOpacity>
            ):(
                <></>
            )
          
        )}
        />
        
    </View>
  )
}

export default Youruploadscreen

const styles = StyleSheet.create({})