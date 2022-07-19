import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Profilescreen = ({navigation}) => {
  const logout = () => {
    signOut(auth);
    navigation.navigate('login');
  }
  return (
    <View>
      <Text>profilescreen</Text>
      <Button title="Your Uploads" onPress={()=>navigation.navigate('uploads')}/>
      <Button title="Saved Posts" onPress={()=>navigation.navigate('saved')}/>
      <Button title='logout' onPress={logout}/>
    </View>
  )
}

export default Profilescreen

const styles = StyleSheet.create({})