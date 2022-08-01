import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button,ImageBackground,StatusBar, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query} from 'firebase/firestore';
import { db } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    <View style={{alignItems: 'center', backgroundColor: '#dee0df', flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={{backgroundColor: '#fff', height:65, width: 360, paddingTop: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity TouchableOpacity style={{marginLeft: 15}}onPress={()=>{navigation.goBack()}}>
                <Icon name="angle-left" size={35} color="black" />
          </TouchableOpacity>
          <Text style={{marginLeft: 30, fontSize: 20}}>Search Results</Text>
      </View>
      
      <ScrollView>
      <FlatList
        data={posts}
        horizontal={false}
        numColumns={2}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
          
            <TouchableOpacity onPress={()=>navigation.navigate('details', item.id )}>
              <ImageBackground source={{uri: item.imageUrl}}  imageStyle={{ borderRadius: 17}} style={{height: 120, width: 150, margin: 8 }}>
                <View style={{backgroundColor: 'black', borderRadius: 17, height: 120, width: 150, opacity: 0.5}}>
                  <Text style={{fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 65, marginLeft: 10}}>{item.title}</Text>
                  <Text style={{color: '#fff', marginLeft: 10, fontSize: 12}}>by: {item.creatorName}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          
          
        )}
        />
        </ScrollView>
    </View>
  )
}

export default Searchresultscreen

const styles = StyleSheet.create({})