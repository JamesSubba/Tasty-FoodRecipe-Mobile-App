import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';

const Registerscreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const register = () => {
        setIsLoading(!isLoading);
        createUserWithEmailAndPassword(auth, email, password)
        .then((authUser)=> {
            const collectionRef = collection(db, 'users');
            addDoc(collectionRef, {
                displayName: name, 
                email: email,
                uid: authUser.user.uid
            });
            console.log(`user with uid ${authUser.user.uid} created`);
            updateProfile(authUser.user, {
                displayName: name
              });
            console.log('profile updated');
            navigation.navigate('login')
        })
        .catch((error)=> {
            console.log(error.message);
        })
    }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff'}}   >
      <ScrollView>
      <View style={styles.container}>

      <TouchableOpacity style={{marginRight: 300}}onPress={()=>{navigation.navigate('login')}}>
        <Icon name="chevron-circle-left" size={35} color="#d6d6d6" />
      </TouchableOpacity>

      <Text style={{color: "#E56B6F", fontSize: 35, fontWeight: 'bold', marginTop: 20}}>Register</Text>
      <Text style={{color: "#807f7d"}}>Create your new account</Text>

      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'89%',borderRadius:10,height:60,paddingLeft:20, marginTop: 50}}>
        <Icon name="user-circle" size={22} color="#818181" />
        <TextInput placeholder='Name' value={name} onChangeText={(text)=> setName(text)} style={styles.input}/>
      </View>

      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'89%',borderRadius:10,height:60,paddingLeft:20, marginTop: 20}}>
        <Icon name="envelope" size={22} color="#818181" />
        <TextInput placeholder='Email' value={email} onChangeText={(text)=> setEmail(text)} style={styles.input}/>
      </View>

      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'89%',borderRadius:10,height:60,paddingLeft:20, marginTop: 20}}>
        <Icon name="lock" size={26} color="#818181" />
        <TextInput placeholder='Password'  value={password} onChangeText={(text)=> setPassword(text)} style={styles.input} secureTextEntry={true}/>
      </View>

      <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'89%',borderRadius:10,height:60,paddingLeft:20, marginTop: 20}}>
        <Icon name="lock" size={26} color="#818181" />
        <TextInput placeholder='Confirm Password'   style={styles.input} secureTextEntry={true}/>
      </View>
    
      <TouchableOpacity style={styles.appButtonContainer} onPress={register}>
        {isLoading && <ActivityIndicator size={15} color="#fff" />}
          <Text style={styles.appButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}} onPress={()=> navigation.navigate('login')}>
          <Text style={{justifyContent: 'flex-end', color: "#807f7d" }}>Already have an account? </Text>
          <Text style={{color: "#E56B6F", textDecorationLine: 'underline'}}>SignIn</Text>
      </TouchableOpacity>
    </View>
      </ScrollView>
    </KeyboardAvoidingView>
    
  )
}

export default Registerscreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection:'column',
    paddingTop:30,
    paddingHorizontal:'3%',
    backgroundColor: "#ffffff"
  },
  input:{
    position:'relative',
    height:'100%',
    width:'90%',
    paddingLeft:20,
  },
  appButtonContainer: {
    elevation: 6,
    backgroundColor: "#E56B6F",
    borderRadius: 30,
    paddingVertical: 13,
    width: 255,
    marginBottom: 10,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center'

  },
  appButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  }
})