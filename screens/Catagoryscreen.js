import { StyleSheet, Text, View, FlatList, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query} from 'firebase/firestore';
import { db } from '../firebase';

const Catagoryscreen = ({route, navigation}) => {
    const [posts, setPosts] = useState([]);
    const catagoryy = route.params;

    useEffect(()=> {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef);
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
      <Button title="goBack" onPress={()=>navigation.navigate('home')} />
      <Text>{catagoryy}</Text>
      <FlatList
        data={posts}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
            catagoryy===item.catagory?(
                <View>
            <Text>Title: {item.title}</Text>
            <Text>Catagory: {item.catagory}</Text>
            <Text>CreatedBy: {item.creatorName}</Text>
          </View>
            ):(
                <></>
            )
          
        )}
        />
    </View>
  )
}

export default Catagoryscreen

const styles = StyleSheet.create({})