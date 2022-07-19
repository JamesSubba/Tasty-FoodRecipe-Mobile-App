import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const Loginscreen = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then((authUser)=> {
            console.log(`user with uid ${authUser.user.uid} signed in`);
            navigation.replace('home');
        })
        .catch((error)=> {
            console.log(error.message);
        })
    }

    const forgotPassword = () => {
        if(email){
            sendPasswordResetEmail(auth, email)
            .then(()=> {
                console.log(`reset password sent to email: ${email}`);
            })
            .catch((error)=> {
                console.log(error.message);
            })
        }
    }
    
  return (
    <View>
      <Text>loginscreen</Text>
      <TextInput placeholder="Email" value={email} onChangeText={(text)=> setEmail(text)}/>
      <TextInput placeholder="Password" value={password} onChangeText={(text)=> setPassword(text)}/>
      <Button title="Login" onPress={login}/>
      <Button title="Register" onPress={()=> navigation.navigate('register')}/>
      <TouchableOpacity onPress={forgotPassword}>
        <Text>Forgot Passowrd?</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Loginscreen