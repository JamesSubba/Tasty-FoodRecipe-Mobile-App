import 'react-native-gesture-handler';
import { StyleSheet,  Easing } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionSpecs, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'
import loginscreen from './screens/Loginscreen';
import registerscreen from './screens/Registerscreen';
import homescreen from './screens/Homescreen';
import postscreen from './screens/Postscreen';
import youruploadscreen from './screens/Youruploadscreen';
import catagoryscreen from './screens/Catagoryscreen';                                 
import detailsscreen from './screens/Detailsscreen';
import searchresultscreen from './screens/Searchresultscreen';
import savedpostscreen from './screens/Savedpostscreen';
import Youruploaddetailscreen from './screens/Youruploaddetailscreen';
import Savedpostdetailsscreen from './screens/Savedpostdetailsscreen';
import EditPostScreen from './screens/EditPostScreen';
import OnboardingScreen from './screens/OnboardingScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 100,
    mass: 3,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  }
}

const closeConfig = {
  animation: 'timing',
  config: {
    duration: 200,
    easing: Easing.linear,
  }
}

const customTransition = {
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
  cardStyleInterpolator: ({ current, next, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            })
          },
          {
            rotate: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: ["180deg", "0deg"],
            }),
          },
          {
            scale: next ?
              next.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.7],
              }) : 1,
          }
        ]
      },
      opacity: current.opacity,
    }
  }
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
      headerShown: false,
      gestureEnabled: true,
      gestureDirection: 'horizontal',
    }} >
        <Stack.Screen name='onboarding' component={OnboardingScreen}/>
        <Stack.Screen name='login' component={loginscreen} />
        <Stack.Screen name='register' component={registerscreen}  options={{
          transitionSpec: {
            open: config,
            close: closeConfig,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}/>
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
        <Stack.Screen name='catagory' component={catagoryscreen}/>
        <Stack.Screen name='details' component={detailsscreen}/>
        <Stack.Screen  name='search' component={searchresultscreen}/>
      </Stack.Navigator>
  )
}

const StackNavigator2 = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
        <Stack.Screen name='uploads' component={youruploadscreen}/>
        <Stack.Screen name="uploadDetail" component={Youruploaddetailscreen}/>
        <Stack.Screen name='editPost' component={EditPostScreen}/>
      </Stack.Navigator>
  )
}
const StackNavigator3 = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
        <Stack.Screen name='saved' component={savedpostscreen}/>
        <Stack.Screen name='savedDetial' component={Savedpostdetailsscreen}/>
      </Stack.Navigator>
  )
}

const BottomTabNavigator = () =>{
  return(
    <Tab.Navigator tabBarOptions={{showLabel: false}} screenOptions={{headerShown: false}}>
        <Tab.Screen name="Home" component={StackNavigator1} options={{tabBarIcon: ({focused})=> (
          <Icon name="home" size={26} color={focused ? "#E56B6F": "#A09F9F"} />
        )}} /> 
        <Tab.Screen name='post' component={postscreen} options={{tabBarIcon: ({focused})=> (
          <Icon name="plus-square-o" size={26} color={focused ? "#E56B6F": "#A09F9F"} />
        )}}/>
        <Tab.Screen name='Upload' component={StackNavigator2} options={{tabBarIcon: ({focused})=> (
          <Icon name="upload" size={26} color={focused ? "#E56B6F": "#A09F9F"} />
        )}}/>
        <Tab.Screen name="Saved" component={StackNavigator3} options={{tabBarIcon: ({focused})=> (
          <Icon name="bookmark" size={26} color={focused ? "#E56B6F": "#A09F9F"} />
        )}}/>
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
