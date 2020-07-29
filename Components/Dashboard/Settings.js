import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, AsyncStorage } from 'react-native'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions'
import { Card, CardItem, } from 'native-base'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import AuthLodingScreen from '../AuthScreen/Auth'

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

console.disableYellowBox = true;

export default class SettingScreen extends Component {

    constructor(props) {
        super(props),
            this.state = {
                temp: '', initialRegion: null,
                ShopName: '', PhoneNumber: '',
                ShopDescription: '', ShopAvtar: '',
                ShopLocation: '', marker: null,
            }
    }

    componentWillMount = async () => {
        var CurrentId = await AsyncStorage.getItem('UserId')
        await firebase.firestore().collection('Shops').where('Seller_id', '==', CurrentId).get().then(snapshot => {
            snapshot.docs.forEach(doc => {
                console.log('i am in maps',doc.data())
                this.setState({ temp: doc.data() })
            })
        })
        this.setState({
            initialRegion: {
                latitude: this.state.temp["location"]["_lat"],
                longitude: this.state.temp["location"]["_long"],
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            marker: {
                latitude: this.state.temp["location"]["_lat"],
                longitude: this.state.temp["location"]["_long"],
            }
        })
    }

    _LogOut = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('Login')
    }

    _ImagePicker() {
        let image_url = this.state.temp["avatar_url"]
        return (
            <TouchableOpacity style={Styles.ShopAvtar}>
                <View>
                    <Image source={this.state.temp["avatar_url"] ? { uri: this.state.temp["avatar_url"] } : require('../../Images/product2.png')}
                        style={Styles.ImageStyle}
                    />
                </View>
            </TouchableOpacity>
        )
    }


    render() {
        let marker;
        if (this.state.marker)
            marker = <Marker coordinate={this.state.marker} />
        return (
            <View style={Styles.Container}>
                <Card style={Styles.ProfileCard}>
                    <View style={Styles.header}>
                        <Text style={Styles.HeaderText}>Shop Details</Text>
                    </View>
                    <View>
                        <View>
                            {this._ImagePicker()}
                        </View>

                        <TextInput
                            style={Styles.inputField}
                            value={this.state.temp["Shopname"]}
                            placeholder='Shop Name'
                            editable={false}
                            underlineColorAndroid="transparent"
                        />

                        <TextInput
                            style={Styles.inputField}
                            placeholder='Phone Number'
                            value={this.state.temp["ShopNumber"]}
                            editable={false}
                            underlineColorAndroid="transparent"
                        />

                        <TextInput
                            style={Styles.inputField}
                            placeholder='Shop Description'
                            value={this.state.temp["Discription"]}
                            editable={false}
                            underlineColorAndroid="transparent"
                        />

                        <View style={Styles.MapView}>
                            <MapView
                                style={Styles.MapStyle}
                                provider={PROVIDER_GOOGLE}
                                userInteraction={false}
                                rotateEnabled={false}
                                followsUserLocation={true}
                                initialRegion={this.state.initialRegion}
                                loadingEnabled={true}
                            >
                                {marker}
                            </MapView>
                        </View>
                    </View>
                </Card>
                <TouchableOpacity
                    onPress={this._LogOut}
                    style={Styles.logOutBtn}>
                    <Text style={Styles.logOutBtnText}>LogOut</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    Container: {
        height: responsiveHeight(100),
        width: responsiveWidth(100),
        flex: 1,
        backgroundColor: '#60c7d9',
    },
    ProfileCard: {
        height: responsiveHeight(70),
        width: responsiveWidth(90),
        alignSelf: 'center',
        top: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        opacity: 0.8,
        elevation: 10
    },
    HeaderText: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        top: 10,
        color: '#60c7d9',
    },
    ShopAvtar: {
        height: responsiveHeight(20),
        width: responsiveWidth(40),
        backgroundColor: 'white',
        alignSelf: 'center',
        top: 20,
        justifyContent: 'center',
        borderRadius: 10,
    },
    ImageStyle: {
        alignSelf: 'center',
        height: responsiveHeight(15),
        width: responsiveWidth(30),
        justifyContent: 'center',
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    inputField: {
        height: responsiveHeight(6),
        width: responsiveWidth(75),
        top: 30,
        fontSize: 15,
        borderRadius: 10,
        color: 'black',
        backgroundColor: 'rgba(96,199,217,0.2)',
        alignSelf: 'center',
        marginBottom: 10
    },
    MapStyle: {
        top: 30,
        height: responsiveHeight(20),
        width: responsiveWidth(75),
        alignSelf: 'center'
    },
    logOutBtn: {
        top: 20,
        height: responsiveHeight(10),
        width: responsiveWidth(85),
        backgroundColor: 'rgba(255,255,255,0.8)',
        alignSelf: 'center',
        borderRadius: 15,
        textAlign: 'center'
    },
    logOutBtnText: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2.8),
        fontWeight: 'bold',
        top: 20,
        color: '#60c7d9',
    }
})