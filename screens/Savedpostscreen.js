import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import { db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

const Savedpostscreen = ({navigation}) => {
    const [saved, setSaves] = useState([]);
    const [uid, setUid] = useState('')
    useEffect(()=> {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const uid = user.uid;     
                setUid(uid);
            } 
          });
        const collectionRef = collection(db, 'saves');
        const q = query(collectionRef, orderBy('savedAt','desc'));
        onSnapshot(q, (snapshot)=> {
        const data = snapshot.docs.map((doc)=> ({
            id: doc.id,
            ...doc.data()
        }))
        setSaves(data);
        })
    },[]);

  return (
    <View>
      <Text>savedpostscreen</Text>
      <Button title="goBack" onPress={()=>navigation.navigate('profile')} />
      <FlatList
        data={saved}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
            uid===item.savedBy?(
                <TouchableOpacity onPress={()=>navigation.navigate('savedDetial', item.postId)}>
                    <Text>Title: {item.title}</Text>
                    <Text>CreatedBy: {item.CreatedBy}</Text>
                </TouchableOpacity>
            ):(
                <></>
            )
          
        )}
        />
    </View>
  )
}

export default Savedpostscreen

const styles = StyleSheet.create({})