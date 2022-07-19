import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import loginscreen from './screens/Loginscreen';
import registerscreen from './screens/Registerscreen';
import homescreen from './screens/Homescreen';
import postscreen from './screens/Postscreen';
import youruploadscreen from './screens/Youruploadscreen';
import catagoryscreen from './screens/Catagoryscreen';                                 
import detailsscreen from './screens/Detailsscreen';
import searchresultscreen from './screens/Searchresultscreen';
import profilescreen from './screens/Profilescreen';
import savedpostscreen from './screens/Savedpostscreen';
import Youruploaddetailscreen from './screens/Youruploaddetailscreen';
import Savedpostdetailsscreen from './screens/Savedpostdetailsscreen';
import EditPostScreen from './screens/EditPostScreen';
import EditProfile from './screens/EditProfile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
      headerShown: false
    }} >
        <Stack.Screen name='login' component={loginscreen}/>
        <Stack.Screen name='register' component={registerscreen}/>
        <Stack.Screen name="home" component={BottomTabNavigator}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const StackNavigator1 = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
        <Stack.Screen name='home' component={homescreen}/>
        {/* <Stack.Screen name='post' component={postscreen}/> */}
        {/* <Stack.Screen name='uploads' component={youruploadscreen}/> */}
        <Stack.Screen name='catagory' component={catagoryscreen}/>
        <Stack.Screen name='details' component={detailsscreen}/>
        <Stack.Screen name='search' component={searchresultscreen}/>
        {/* <Stack.Screen name='profile' component={profilescreen}/>
        <Stack.Screen name='saved' component={savedpostscreen}/> */}
      </Stack.Navigator>
  )
}

const StackNavigator2 = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
        <Stack.Screen name='profile' component={profilescreen}/>
        <Stack.Screen name='uploads' component={youruploadscreen}/>
        <Stack.Screen name="uploadDetail" component={Youruploaddetailscreen}/>
        <Stack.Screen name='saved' component={savedpostscreen}/>
        <Stack.Screen name='savedDetial' component={Savedpostdetailsscreen}/>
        <Stack.Screen name='editPost' component={EditPostScreen}/>
        <Stack.Screen name='editProfiles' component={EditProfile}/>

      </Stack.Navigator>
  )
}

const BottomTabNavigator = () =>{
  return(
    <Tab.Navigator screenOptions={{
      headerShown: false
    }}>
        <Tab.Screen name="Home" component={StackNavigator1} />
        <Tab.Screen name='post' component={postscreen}/>
        <Tab.Screen name="Profile" component={StackNavigator2} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
