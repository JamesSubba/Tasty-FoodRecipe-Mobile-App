import { StyleSheet, Text, View, Button, FlatList, TextInput, TouchableOpacity, StatusBar,ImageBackground, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/FontAwesome'
// import AsyncStorage from '@react-native-async-storage/async-storage';

const Homescreen = ({navigation}) => {
  const [currentUserName, setCurrentUserName] = useState(''); 
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState('');
  var cat1 = "Breakfast";
  var cat2 = "Lunch";
  var cat3 = "Dinner";
  var cat4 = "Snacks";

  useEffect(()=> {
    onAuthStateChanged(auth, (user) => {
      if (user) {
          const displayName = user.displayName;     
          setName(displayName);
      } 
    });
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

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
      
      <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={logout} >
        <Icon name="sign-out" size={26} color="#818181" />
        <Text style={{marginLeft: 20}}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
  const logout = () => {
    try {
      // await AsyncStorage.removeItem('@viewdOnboarding')
      signOut(auth);
      navigation.navigate('login');
    }
    catch (err){
      console.log(err)
    }
    
  }

  const bs = React.createRef();
  const fall = new Animated.Value(1);

  return (
    <View style={styles.container}> 
    <StatusBar translucent backgroundColor="transparent" />
    <BottomSheet
        ref={bs}
        snapPoints={[330, 0]}
        renderContent={renderInner}

        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />

      <ImageBackground source={require('../assets/BackgroundImages/Home.png')} resizeMode="cover" style={styles.backgroundImage}>
      <TouchableOpacity style={{ width: 30, marginLeft: 320, marginTop: 10}}onPress={() => bs.current.snapTo(0)}><Icon name="navicon" size={30} color="#fff" style={{ marginTop: 15}}/></TouchableOpacity>
      <View>
        <Text style={{fontSize: 30, color: '#fff', marginLeft: 20, fontWeight: 'bold'}}>Hi, {name}!</Text>
        <Text style={{color: '#fff', fontSize: 12, marginLeft: 20}}>Explore the recipes for the dish of your dream</Text>
      </View>
      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#fff',width:'89%',borderRadius:30,height:50,paddingLeft:20, marginTop: 12, marginLeft: 20}}>
        <TouchableOpacity onPress={searchPost}>
          <Icon name="search" size={26} color="#818181" />
        </TouchableOpacity>
        <TextInput placeholder="Search Food Names"onChangeText={(text)=> setSearch(text)} style={styles.input}/>
      </View>

      <View style={{marginTop: 30, backgroundColor: '#FFF'}}> 
        <Text style={{fontSize: 15, color: '#A09F9F', marginLeft: 20, marginBottom: 8}}>Category</Text>
        <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity onPress={()=>navigation.navigate('catagory', cat1)}>
            <View style={{backgroundColor: "#355070", padding: 13, paddingHorizontal: 20, borderRadius: 15, marginLeft: 20}}>
              <Text style={{color: '#fff'}}>Breakfast</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('catagory', cat2)}>
            <View style={{backgroundColor: "#355070", padding: 13, paddingHorizontal: 30, borderRadius: 15, marginLeft: 10}}>
              <Text style={{color: '#fff'}}>Lunch</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('catagory', cat3)}>
            <View style={{backgroundColor: "#355070", padding: 13, paddingHorizontal: 30, borderRadius: 15, marginLeft: 10}}>
              <Text style={{color: '#fff'}}>Dinner</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>navigation.navigate('catagory', cat4)}>
            <View style={{backgroundColor: "#355070", padding: 13, paddingHorizontal: 30, borderRadius: 15, marginLeft: 10}}>
              <Text style={{color: '#fff'}}>Snacks</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={{marginTop: 0, backgroundColor: '#FFF'}}>
        <Text style={{fontSize: 15, color: '#A09F9F', marginLeft: 20, marginBottom: 5, marginTop: 10}}>Recent Posts</Text>
      </View>

      <View style={{alignItems: 'center', backgroundColor: '#FFF'}}>
      <FlatList
          data={posts.slice(0,4)}
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
      </View>
      </ImageBackground>
    
      
    </View>
  )
}

export default Homescreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  panel: {
    marginTop: 240,
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    borderRadius: 20,
    height: 100
  },
  input:{
    position:'relative',
    height:'100%',
    width:'90%',
    paddingLeft:20,
    color: '#A09F9F'
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: "black",
    width: 360,
    height: 690
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