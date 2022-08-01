import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity,StatusBar, ScrollView, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import { db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    <View style={{alignItems: 'center', backgroundColor: '#dee0df', flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <View style={{backgroundColor: '#fff', height:65, width: 360, paddingTop: 20, marginBottom: 3, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity TouchableOpacity style={{marginLeft: 15}}onPress={()=>{navigation.goBack()}}>
                <Icon name="angle-left" size={35} color="black" />
          </TouchableOpacity>
          <Text style={{marginLeft: 30, fontSize: 20}}>Saved Posts</Text>
      </View>      
      <ScrollView>
        <FlatList
            data={saved}
            horizontal={false}
            numColumns={3}
            keyExtractor={item=>item.id}
            renderItem={({item})=>(
                uid===item.savedBy?(
                    <TouchableOpacity onPress={()=>navigation.navigate('savedDetial', {id: item.postId,sid: item.id} )}>
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

export default Savedpostscreen

const styles = StyleSheet.create({})