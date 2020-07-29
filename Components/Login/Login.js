import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, StatusBar, SafeAreaView, ImageBackground, AsyncStorage, } from 'react-native';
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { Card, CardItem, } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'

import { login } from '../AuthScreen/Auth'


export default class LoginScreen extends Component {

    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props),
            this.state = {
                email: '',
                password: '',
            }
        this.initialState = this.state
    }

    SubmitForm = async () => {
        console.log('i am login', this.state)
        await AsyncStorage.setItem('Email', this.state.email)
        await login(this.state.email, this.state.password).then(async () => {
            this.props.navigation.navigate('App')
        })
    }

    render() {
        return (
            <SafeAreaView style={Styles.MainContainer}>
                <StatusBar backgroundColor="#b8b8b8" barStyle="light-content" />
                <ImageBackground source={require('../../Images/background.jpg')} style={Styles.backgroundImage} >
                    <View style={Styles.BackgroundBlur}>

                        <Card style={Styles.LoginCard}>
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#e5e5e5', '#b8b8b8', '#e5e5e5']} style={Styles.CardStyle}>
                                <View style={Styles.SlognView}>
                                    <Text style={Styles.Slogan1}>Be unique.</Text>
                                    <Text style={Styles.Slogan2}>Be healthy.</Text>
                                    <Text style={Styles.Slogan3}>Be happy.</Text>
                                </View>

                                <View style={Styles.ImageView}>
                                    <Image
                                        source={require('../../Images/user.png')}
                                        style={Styles.ImageStyle}
                                    />
                                    <TextInput
                                        style={Styles.inputField}
                                        placeholder='Enter Email'
                                        underlineColorAndroid="transparent"
                                        onChangeText={Email => this.setState({ "email": Email })}
                                        value={this.state.email}
                                    />
                                </View>

                                <View style={Styles.ImageView}>
                                    <Image
                                        source={require('../../Images/lock.png')}
                                        style={Styles.ImageStyle}
                                    />
                                    <TextInput
                                        style={Styles.inputField}
                                        placeholder='Enter Password'
                                        keyboardType='default'
                                        underlineColorAndroid="transparent"
                                        secureTextEntry={true}
                                        onChangeText={Password => this.setState({ "password": Password })}
                                        value={this.state.password}
                                    />
                                </View>
                                <TouchableOpacity style={Styles.LoginBtn} onPress={this.SubmitForm}>
                                    <Text style={Styles.BtnText}>Log In</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={Styles.ForgetBtn}>
                                    <Text style={Styles.TextStyle}>Forgot Password?</Text>
                                </TouchableOpacity>
                                <Text style={Styles.LineSplit}> ────────────  or  ──────────── </Text>
                                <TouchableOpacity
                                    style={Styles.CreateBtn}
                                    onPress={() => {
                                        this.setState(this.initialState);
                                        this.props.navigation.navigate('Signup')
                                    }}>
                                    <Text style={Styles.TextStyle}>Create Account</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </Card>

                    </View>
                </ImageBackground>
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
    backgroundImage: {
        flex: 1,
        height: responsiveHeight(100),
        width: responsiveWidth(100),
        justifyContent: "center",
        alignItems: "center",
    },
    BackgroundBlur: {
        height: responsiveHeight(100),
        width: responsiveWidth(100),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(229,229,229,0.6)'
    },
    LoginCard: {
        height: responsiveHeight(55),
        width: responsiveWidth(85),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 20
    },
    CardStyle: {
        height: responsiveHeight(55),
        width: responsiveWidth(85),
        borderRadius: 20
    },

    inputField: {
        height: responsiveHeight(7),
        width: responsiveWidth(75),
        fontSize: 15,
        fontWeight: 'bold',
        alignSelf: 'center',
        borderRadius: 10,
        marginLeft: 15,
    },
    ImageView: {
        height: responsiveHeight(7),
        width: responsiveWidth(75),
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 10,
        margin: 10,
        top: 50
    },
    ImageStyle: {
        marginLeft: 15,
    },

    SlognView: {
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        top: 30,
    },
    Slogan1: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: 'rgb(255,255,255)',
        flex: 1,
        marginLeft: 30,
        marginRight: -15
    },
    Slogan2: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        flex: 1,
        marginRight: -15,
        color: 'rgba(255,255,255,0.5)',
    },
    Slogan3: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        flex: 1,
        color: 'rgb(255,255,255)'
    },

    LoginBtn: {
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        borderRadius: 15,
        justifyContent: 'center',
        backgroundColor: '#a6a6a6',
        top: 60,
        alignSelf: 'center'

    },
    BtnText: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2.4),
        color: 'black',
        fontWeight: 'bold',
    },

    ForgetBtn: {
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        borderRadius: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        top: 60
    },
    LineSplit: {
        marginTop: 45,
        opacity: 0.1,
        fontSize: 15,
        alignSelf: 'center',
    },
    CreateBtn: {
        marginTop: 15,
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        borderWidth: 1,
        borderColor: '#a6a6a6',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    TextStyle: {
        fontSize: responsiveFontSize(1.8),
        textAlign: 'center',
        color: '#000000',
        fontWeight: 'bold'
    }

})