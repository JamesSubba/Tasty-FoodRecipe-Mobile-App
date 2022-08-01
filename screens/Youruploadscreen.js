import { StyleSheet, Text, View, Button, FlatList, TouchableOpacity, ImageBackground, ScrollView,StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import { db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    <View  style={{alignItems: 'center', backgroundColor: '#dee0df', flex: 1}}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <View style={{backgroundColor: '#fff', height:65, width: 360, paddingTop: 20, marginBottom: 3, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity TouchableOpacity style={{marginLeft: 15}}onPress={()=>{navigation.goBack()}}>
                <Icon name="angle-left" size={35} color="black" />
          </TouchableOpacity>
          <Text style={{marginLeft: 30, fontSize: 20}}>Your Uploads</Text>
      </View>
      <ScrollView >
      <FlatList
        data={posts}
        horizontal={false}
        numColumns={3}
        keyExtractor={item=>item.id}
        renderItem={({item})=>(
            uid===item.creatorUID?(
              
              <TouchableOpacity onPress={()=>navigation.navigate('uploadDetail', item.id )}>
                <ImageBackground source={{uri: item.imageUrl}} style={{height: 120, width: 113, margin: 3 }}>
                  <View style={{backgroundColor: 'black', height: 120, width: 113, opacity: 0.3}}>
                    
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            
            ):(
                <></>
            )
          
        )}
        />
        </ScrollView>
        
    </View>
  )
}

export default Youruploadscreen

const styles = StyleSheet.create({})