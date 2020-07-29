import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar, SafeAreaView, ImageBackground, AsyncStorage, } from 'react-native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { Card, CardItem, } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import AuthLodingScreen from '../AuthScreen/Auth'

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';


export default class ChatScreen extends Component {

    render() {
        return (
            <SafeAreaView style={Styles.MainContainer}>
                <StatusBar backgroundColor="#b8b8b8" barStyle="light-content" />
                <Text>Hello ChatScreen</Text>
            </SafeAreaView>
        )
    }
}

const Styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})