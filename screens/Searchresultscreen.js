import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query} from 'firebase/firestore';
import { db } from '../firebase';

const Searchresultscreen = ({route, navigation}) => {
    const searchResult = route.params;
    const [posts, setPosts] = useState([]);

    useEffect(()=> {
        const collectionRef = collection(db, 'posts');
        const q = query(collectionRef);
        onSnapshot(q, (snapshot)=> {
          const data = snapshot.docs.map((doc)=> ({
            id: doc.id,
            ...doc.data()
          }))
          setPosts( 
            data.filter(
              (data)=>  data.title.toLowerCase().includes(searchResult.toLowerCase()) || data.creatorName.toLowerCase().includes(searchResult.toLowerCase()) 
              ) 
            );
          
        })
      },[]);
    // useEffect(()=> {
    //     setPosts(posts.filter((posts)=> posts.title.toLowerCase().includes(searchResult.toLowerCase())))
    // }, []);
  return (
    <View>
      <Button title="goBack" onPress={()=>navigation.navigate('home')} />
      <Text>food name</Text>
      <FlatList
        data={posts}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
          <TouchableOpacity onPress={()=>navigation.navigate('details', item.id )}>
            <View>
              <Text>Title: {item.title}</Text>
              <Text>Catagory: {item.catagory}</Text>
              <Text>CreatedBy: {item.creatorName}</Text>
            </View>
          </TouchableOpacity>
        )}
        />
    </View>
  )
}

export default Searchresultscreen

const styles = StyleSheet.create({})