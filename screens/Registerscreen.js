import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const Registerscreen = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const register = () => {
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
    <View>
      <Text>registerscreen</Text>
      <TextInput placeholder='Name' value={name} onChangeText={(text)=> setName(text)}/>
      <TextInput placeholder='Email' value={email} onChangeText={(text)=> setEmail(text)}/>
      <TextInput placeholder='Password' value={password} onChangeText={(text)=> setPassword(text)}/>

      <Button title="Sign Up" onPress={register}/>

    </View>
  )
}

export default Registerscreen

const styles = StyleSheet.create({})