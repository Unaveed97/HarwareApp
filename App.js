import React, { Component } from 'react';
import { View, AsyncStorage, Image } from 'react-native';
import { createSwitchNavigator, createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import {decode, encode} from 'base-64'

import SignUpScreen from './Components/SignUp/Signup'
import SignUpScreen2 from './Components/SignUp/Signup2'
import LoginScreen from './Components/Login/Login'
import HomeScreen from './Components/Dashboard/Dashboard'
import SettingScreen from './Components/Dashboard/Settings'
import ChatScreen from './Components/Dashboard/Settings'
import ProductScreen from './Components/Dashboard/Product'
import AuthLodingScreen from './Components/AuthScreen/Auth'


import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

window.addEventListener = x => x;
//import TabNavigator from './Screens/TabNavigator'
console.disableYellowBox = true;


if (!global.btoa) {  global.btoa = encode }

if (!global.atob) { global.atob = decode }

var firebaseConfig = {
  apiKey: "AIzaSyCBuYMr9VceHuHhBiuL26KdkKdNp-ql88g",
  authDomain: "groceryapp-476c8.firebaseapp.com",
  databaseURL: "https://groceryapp-476c8.firebaseio.com",
  projectId: "groceryapp-476c8",
  storageBucket: "groceryapp-476c8.appspot.com",
  messagingSenderId: "702463648312",
  appId: "1:702463648312:web:874d86609af4a2192efccd",
  measurementId: "G-12VF4CBJS8"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Chat: ChatScreen,
})

const AuthStack = createStackNavigator({ Login: LoginScreen })

const TabNavigator = createBottomTabNavigator({
  Home: AppStack,
  products: ProductScreen,
  Chats: ChatScreen,
  Setting: SettingScreen,
}, {
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focuesd, horizontal, tintColor, }) => {
      const { routeName } = navigation.state
      let imageName = require('./Images/home.png')
      if (routeName === 'products') {
        imageName = require('./Images/product.png')
      }
      if (routeName === 'Chats') {
        imageName = require('./Images/Chats.png')
      }
      if (routeName === 'Setting') {
        imageName = require('./Images/settings.png')
      }
      return <Image source={imageName} style={{ width: 25, resizeMode: 'contain', tintColor }} />
    }
  }),
  tabBarOptions: {
    activeTintColor: '#60c7d9',
    inactiveTintColor: 'gray',
    style: {
      backgroundColor: 'rgb(255,255,255)',//color you want to change
    }
  }
})


export default createAppContainer(createSwitchNavigator({
  
  AuthLoading: AuthLodingScreen,
  App: TabNavigator,
  Auth: AuthStack,
  Signup: SignUpScreen,
  Signup2: SignUpScreen2,
},
  {
    initialRouteName: 'AuthLoading'
  }))