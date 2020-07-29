import React, { Component } from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, ImageBackground, Image, TextInput, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import { Card } from 'native-base'
import { responsiveFontSize, responsiveWidth, responsiveHeight, responsiveScreenFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient'

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { signup, getCurrentUserObj, logout } from '../AuthScreen/Auth'

console.disableYellowBox = true;

export default class SignUp extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            UserName: '', email: '',
            password: '', confirmPassword: '',
            PhoneNumber: '', UserId: '',

            errUs: '', errem: '',
            errps: '', errpn: '',
            errcps: '',

            btnIndicator: false, signupError: '',
            btnDisabled: false, signupErrorDialog: false,

            isModalVisible: false,
            visible: false,

            marker: null,
            initialPosition: null,
            FinalPosition: null,
            userObj: null
        }
        this.initialState = this.state
        this.validate = this.validate.bind(this)
        this.isFormEmpty = this.isFormEmpty.bind(this)
        this.isErrorFree = this.isErrorFree.bind(this)
    }
    validate(text, type) {
        if (type == 'UserName') {
            this.setState({ UserName: text })
            let msg = this.getMatch(/^[a-zA-Z]+(([\'\,\.\-][a-zA-Z])?[a-zA-Z])$/, text, "Username only contains alphabets")
            this.setState({ errfn: msg })
        }
        else if (type == 'email') {
            this.setState({ email: text })
            let msg = this.getMatch(/[A-Za-z]+([A-Za-z0-9]|[.]|[_])*[@][A-Za-z]+[.]com$/, text, "Email format example abc@abc.com")
            this.setState({ errem: msg })
        }
        else if (type == 'password') {
            this.setState({ password: text })
            let msg = this.getMatch(/^.{6,20}$/, text, "Password must be between  to 20 characters")
            this.setState({ errps: msg })
        }
        else if (type == 'confirmPassword') {
            this.setState({ confirmPassword: text })
            if (this.state.password != text)
                this.setState({ errcps: "Does not match password" })
            else
                this.setState({ errcps: "" })
        }
        else if (type == 'PhoneNumber') {
            this.setState({ PhoneNumber: text })
            let msg = this.getMatch(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/, text, "Phone Number Incorrect")
            this.setState({ errpn: msg })
        }
    }

    isFormEmpty() {
        if (this.state.UserName != '' && this.state.email != '' && this.state.password != '' && this.state.confirmPassword != '' && this.state.PhoneNumber != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isErrorFree() {
        if (this.state.errUs == '' && this.state.errem == '' && this.state.errps == '' && this.state.errpn == '' && this.state.errcps == '')
            return true
        this.setState({ formErrorDialog: true })
        return false
    }

    getMatch(regex, text, errMsg) {
        let msg = ''
        if (regex.test(text))
            msg = ""
        else
            msg = errMsg
        return msg
    }

    goToForm = async () => {
        console.log('i am here')
        if (!this.isFormEmpty() && this.isErrorFree()) {
            this.setState({ btnDisabled: true })
            this.setState({ btnIndicator: true })
            console.log('i am here2')
            await signup(this.state.email, this.state.password).then(async () => {
                console.log('i am here3')
                var user = auth().currentUser;
                if (!user)
                    throw new Exception()
                if (getCurrentUserObj()) {
                    console.log('i am here4')
                    this.setState({ UserId: user.uid })
                    console.log("I am here", this.state.UserName)
                    await AsyncStorage.setItem('UserId', user.uid);
                    await firestore().collection('_users').doc().set({
                        'UserName': this.state.UserName,
                        'email': this.state.email,
                        'password': this.state.password,
                        'phonenumber': this.state.PhoneNumber,
                        'userID': user.uid,
                    }).then(() => { console.log('SignUp Sucessful') }).catch((error) => console.log(error.message))
                }
                logout()
                //emailVerification()
                this.setState(this.initialState)
                this.props.navigation.navigate('Signup2', {
                    UserName: this.state.UserName,
                    email: this.state.email,
                    password: this.state.password,
                    phonenumber: this.state.PhoneNumber,
                    UserId: this.state.UserId
                })
            }).catch((error) => {
                this.setState({ signupError: error.message })
                this.setState({ signupErrorDialog: true })
            }
            ).finally(() => {
                this.setState({ btnDisabled: false })
                this.setState({ btnIndicator: false })
            })
        }
        else {
            Alert.alert('Invalid Input Feilds', 'Plzz Input correct feilds')
        }
    }


    render() {
        return (
            <SafeAreaView style={Styles.MainContainer}>
                <StatusBar backgroundColor="#b8b8b8" barStyle="light-content" />
                <ImageBackground source={require('../../Images/background.jpg')} style={Styles.backgroundImage}>
                    <View style={Styles.BackgroundBlur}>

                        <Card style={Styles.SignUpCard}>
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#e5e5e5', '#b8b8b8', '#e5e5e5']} style={Styles.CardStyle}>

                                <View style={Styles.ImageView}>
                                    <View style={{ height: responsiveHeight(7), width: responsiveWidth(75), flexDirection: 'row', }}>
                                        <Image
                                            source={require('../../Images/user.png')}
                                            style={Styles.ImageStyle}
                                        />
                                        <TextInput
                                            style={Styles.inputField}
                                            placeholder='Enter UserName'
                                            underlineColorAndroid="transparent"
                                            onChangeText={text => this.validate(text, "UserName")}
                                            value={this.state.UserName}
                                        />
                                    </View>
                                    < Text style={Styles.error}>
                                        {this.state.errfn}
                                    </Text>
                                </View>


                                <View style={Styles.ImageView}>
                                    <View style={{ height: responsiveHeight(7), width: responsiveWidth(75), flexDirection: 'row', }}>
                                        <Image
                                            source={require('../../Images/mail.png')}
                                            style={Styles.ImageStyle}
                                        />
                                        <TextInput
                                            style={Styles.inputField}
                                            placeholder='Email Address'
                                            keyboardType='email-address'
                                            underlineColorAndroid="transparent"
                                            onChangeText={text => this.validate(text, "email")}
                                            value={this.state.email}
                                        />
                                    </View>
                                    <Text style={Styles.error}>
                                        {this.state.errem}
                                    </Text>
                                </View>

                                <View style={Styles.ImageView}>
                                    <View style={{ height: responsiveHeight(7), width: responsiveWidth(75), flexDirection: 'row', }}>
                                        <Image
                                            source={require('../../Images/lock.png')}
                                            style={Styles.ImageStyle}
                                        />
                                        <TextInput
                                            style={Styles.inputField}
                                            placeholder='Password'
                                            keyboardType='default'
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={true}
                                            onChangeText={text => this.validate(text, "password")}
                                            value={this.state.password}
                                        />
                                    </View>
                                    <Text style={Styles.error}>
                                        {this.state.errps}
                                    </Text>
                                </View>

                                <View style={Styles.ImageView}>
                                    <View style={{ height: responsiveHeight(7), width: responsiveWidth(75), flexDirection: 'row', }}>
                                        <Image
                                            source={require('../../Images/lock.png')}
                                            style={Styles.ImageStyle}
                                        />
                                        <TextInput
                                            style={Styles.inputField}
                                            placeholder='Confirm Password'
                                            keyboardType='default'
                                            underlineColorAndroid="transparent"
                                            secureTextEntry={true}
                                            onChangeText={text => this.validate(text, "confirmPassword")}
                                            value={this.state.confirmPassword}
                                        />
                                    </View>
                                    <Text style={Styles.error}>
                                        {this.state.errcps}
                                    </Text>
                                </View>

                                <View style={Styles.ImageView}>
                                    <View style={{ height: responsiveHeight(7), width: responsiveWidth(75), flexDirection: 'row', }}>
                                        <Image
                                            source={require('../../Images/phone.png')}
                                            style={Styles.ImageStyle}
                                        />
                                        <TextInput
                                            style={Styles.inputField}
                                            placeholder='Phone Number'
                                            keyboardType='number-pad'
                                            underlineColorAndroid="transparent"
                                            onChangeText={text => this.validate(text, "PhoneNumber")}
                                            value={this.state.PhoneNumber}
                                        />
                                    </View>
                                    <Text style={Styles.error}>{
                                        this.state.errpn}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={Styles.SignUpBtn}
                                    onPress={() => this.goToForm()}
                                >
                                    <Text style={Styles.BtnText}>Confirm</Text>
                                </TouchableOpacity>

                                <Text onPress={() => {
                                    this.setState(this.initialState);
                                    this.props.navigation.navigate('Login');
                                }}
                                    style={Styles.backButton}>
                                    Already have an account?
                                    <Text style={{ color: '#008080' }}>Login</Text>
                                </Text>

                            </LinearGradient>
                        </Card>

                    </View>
                </ImageBackground>
            </SafeAreaView >
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
    SignUpCard: {
        height: responsiveHeight(65),
        width: responsiveWidth(85),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 20
    },
    CardStyle: {
        height: responsiveHeight(65),
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
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderRadius: 10,
        margin: 10,
        top: 40
    },
    ImageStyle: {
        height: responsiveHeight(3),
        width: responsiveWidth(6),
        top: 15,
        marginLeft: 15,
    },
    SignUpBtn: {
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
    backButton: {
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        justifyContent: 'center',
        alignSelf: 'center',
        top: 70,
        marginLeft: 50
    },
    error: {
        fontSize: responsiveScreenFontSize(1.8),
        marginTop: responsiveHeight(-3),
        marginLeft: 15,
        color: 'red'
    },
})

