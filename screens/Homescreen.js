import { StyleSheet, Text, View, Button, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';

const Homescreen = ({navigation}) => {
  const [currentUserName, setCurrentUserName] = useState(''); 
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  var cat1 = "Breakfast";
  var cat2 = "Lunch";
  var cat3 = "Dinner";

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

  const searchPost = () => {
    navigation.navigate('search', search);
  }

  return (
    <View>
      <TextInput placeholder="Search..."onChangeText={(text)=> setSearch(text)}/>
      <Button title='Search' onPress={searchPost}/>
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
      <TouchableOpacity onPress={()=>navigation.navigate('catagory', cat1)}>
        <Text>Breakfast</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('catagory', cat2)}>
        <Text>Lunch</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>navigation.navigate('catagory', cat3)}>
        <Text>Dinner</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Homescreen

const styles = StyleSheet.create({})