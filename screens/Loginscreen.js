import { ImageBackground, View, Text, TextInput, ActivityIndicator, Alert, StatusBar,TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView } from 'react-native';
import { auth } from '../firebase';
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome'

const Loginscreen = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const login = () => {
        setIsLoading(!isLoading);
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
              forgotPasswordMessage();
                console.log(`reset password sent to email: ${email}`);
            })
            .catch((error)=> {
                console.log(error.message);
            })
        }
    }
    const forgotPasswordMessage = () =>
    Alert.alert(
      "Forgot Password?",
      "Reset password has been sent to your email",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
    
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff'}}   >
    <ScrollView>
      <ImageBackground source={require('../assets/BackgroundImages/Login.png')} resizeMode="cover" style={styles.backgroundImage} >
      <StatusBar translucent backgroundColor="transparent" />
    <View style={styles.container}>
     
        <Text style={{color: "#E56B6F", fontSize: 35, fontWeight: 'bold'}}>Welcome Back</Text>
        <Text style={{color: "#807f7d"}}>Login to your account</Text>
        
        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'89%',borderRadius:5,height:60,paddingLeft:20, marginBottom: 20, marginTop: 40}}>
          <Icon name="envelope" size={22} color="#818181" />
          <TextInput placeholder="Email" value={email} onChangeText={(text)=> setEmail(text)} style={styles.input}/>
        </View>

        <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',backgroundColor:'#ededed',width:'89%',borderRadius:5,height:60,paddingLeft:20, marginTop: 0}}>
          <Icon name="lock" size={26} color="#818181" />
          <TextInput placeholder="Password" value={password} onChangeText={(text)=> setPassword(text)} style={styles.input} secureTextEntry={true}/>
        </View>
        
        <TouchableOpacity style={{marginLeft: 190, marginTop: 5}} onPress={forgotPassword}>
          <Text style={{color: "#E56B6F", fontWeight: 'bold', fontSize: 12}}>Forgot Passowrd?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.appButtonContainer} onPress={login} >
          {isLoading && <ActivityIndicator size={15} color="#fff" />}
          <Text style={styles.appButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}} onPress={()=> navigation.navigate('register')}>
          <Text style={{justifyContent: 'flex-end', color: "#807f7d" }}>Don't have an account? </Text>
          <Text style={{color: "#E56B6F", textDecorationLine: 'underline'}}>SignUp</Text>
        </TouchableOpacity>
        
    </View>
    </ImageBackground>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Loginscreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection:'column',
    paddingTop:230,
    paddingHorizontal:'3%',
    marginBottom: 10
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    width: 360,
    height: 620
  },
  input:{
    position:'relative',
    height:'100%',
    width:'90%',
    paddingLeft:20,
  },
  appButtonContainer: {
    flexDirection: 'row',
    elevation: 6,
    backgroundColor: "#E56B6F",
    borderRadius: 30,
    paddingVertical: 13,
    width: 255,
    marginBottom: 10,
    marginTop: 30, 
    justifyContent: 'center'
     
  },
  appButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold"  }

});

