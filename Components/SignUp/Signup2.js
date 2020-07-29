import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, StyleSheet, StatusBar, ImageBackground } from 'react-native';
import { Card } from 'native-base'
import { responsiveFontSize, responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import Dialog, { DialogFooter, DialogButton, DialogContent } from 'react-native-popup-dialog'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import Geolocation from '@react-native-community/geolocation'
import { request, PERMISSIONS } from 'react-native-permissions'
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient'
import RNFetchBlob from 'react-native-fetch-blob'

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

import { signup, logout, getCurrentUserObj } from '../AuthScreen/Auth'

console.disableYellowBox = true;

export default class Signup2 extends Component {

    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {

            ShopName: '', shopType: '',
            SellerId: '', ShopNumber: '',
            Discription: '', avatarSource: null,
            shoplatitude: '', shoplongitude: '',
            ImageUrl: '', ImgRes: '',


            errSN: '', errST: '',
            errSID: '', errSPn: '',
            errDI: '', errLo: '',

            formEmptyDialog: false, formErrorDialog: false, btnIndicator: false,
            btnDisabled: false, signupErrorDialog: false, signupError: '',

            isModalVisible: false,
            visible: false,

            marker: null,
            initialPosition: null,
            FinalPosition: '',
            userObj: null
        }
        this.initialState = this.state
        this.validate = this.validate.bind(this)
        this.goToLogin = this.goToLogin.bind(this)
        this.isFormEmpty = this.isFormEmpty.bind(this)
        this.isErrorFree = this.isErrorFree.bind(this)
    }

    validate(text, type) {
        if (type == 'ShopNumber') {
            this.setState({ ShopNumber: text })
            let msg = this.getMatch(/^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/, text, "Phone Number Incorrect")
            this.setState({ errSN: msg })
        }
        else if (type == 'ShopName') {
            this.setState({ ShopName: text })
        }
        else if (type == 'Discription') {
            this.setState({ Discription: text })
        }
    }

    isFormEmpty() {
        if (this.state.ShopNumber != '' && this.state.ShopName != '' && this.state.Discription != '' && this.state.location != '')
            return false
        this.setState({ formEmptyDialog: true })
        return true
    }

    isErrorFree() {
        if (this.state.errSN == '')
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

    // For Map creation //
    componentDidUpdate(prevProps) {
        if (this.props.marker != prevProps.marker)
            this.setState({ marker: this.props.marker })
    }

   /* componentWillMount() {
        if (!this.props.marker)
            this.setState({ marker: this.props.navigation.getParam('marker') })
        this.requestLoctaionPermission()
    }*/

    requestLoctaionPermission = async () => {
        if (Platform.OS === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            if (response === 'granted')
                this.locateCurrentPosition()
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
            if (response === 'granted')
                this.locateCurrentPosition()
        }
    }

    locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(position => {
            if (!this.state.marker) {
                var initialPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            }
            else {
                var initialPosition = {
                    latitude: this.state.marker.latitude,
                    longitude: this.state.marker.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }
            }
            this.setState({ initialPosition: initialPosition })
        }, error => Alert.alert(error.message),
            { enableHighAccuracy: false, timeout: 10000 })
    }

    selectLocation = async () => {
        try {
            var FinalPosition = {
                latitude: this.state.marker.latitude,
                longitude: this.state.marker.longitude,
            }
            await this.setState({ FinalPosition: FinalPosition })
            this.setState({ shoplatitude: this.state.FinalPosition.latitude })
            this.setState({ shoplongitude: this.state.FinalPosition.longitude })
            console.log('this.is me', this.state.FinalPosition)
        } catch (error) {
            console.log(error)
        }
        this.setState({ visible: !this.state.visible });
    }
    // Map Creation //

    toggleModal = () => {
        this.setState({ visible: !this.state.visible });
    };

    //Avatar Selector//
    SelectImage = async () => {
        ImagePicker.showImagePicker({ noDare: true, mediaType: "photo" }, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    avatarSource: response.uri,
                    opacity: 0,
                });
                this.setState({ ImgRes: response.uri })
            }
        });
    }
    //Avatar Selector//

    goToLogin = async () => {
        console.log('I am waiting', JSON.stringify(this.state.ImageUrl))
        await this.uploadImage()
        this.setState({ btnDisabled: true })
        this.setState({ btnIndicator: true })

        var UserId = await AsyncStorage.getItem('UserId');
        if (getCurrentUserObj()) {
            console.log('Hello World', this.state.ImageUrl)
            await firestore().collection('Shops').doc().set({
                'Shopname': this.state.ShopName,
                'ShopNumber': this.state.ShopNumber,
                'Seller_id': UserId,
                'location': new firebase.firestore.GeoPoint(this.state.shoplatitude, this.state.shoplongitude),
                'Discription': this.state.Discription,
                'avatar_url': this.state.ImageUrl
            }).then(() => console.log('I am In')).catch((error) => console.log(error.message))
        }
        //emailVerification()
        this.setState(this.initialState)
        //this.props.navigation.navigate('Login')
    }

    uploadImage = async () => {
        console.log('I am Here', this.state.ImgRes)
        const image = this.state.ImgRes
        const Blob = RNFetchBlob.polyfill.Blob
        const fs = RNFetchBlob.fs
        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        window.Blob = Blob

        let uploadBlob = null
        const imageRef = await firebase.storage().ref('StoreAvatar').child(`${this.state.ShopName}.jpg`)
        let mime = 'image/jpg'
        await fs.readFile(image, 'base64')
            .then((data) => {
                return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
                uploadBlob = blob
                return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
                uploadBlob.close()
                return imageRef.getDownloadURL()
            })
            .then((url) => {
                this.setState({ ImageUrl: url })
                console.log('i am in imageupload', this.state.ImageUrl);
            })
            .catch((error) => {
                console.log(error);

            })
    }



    render() {
        let btnDisplay;
        if (this.state.btnIndicator)
            btnDisplay = <ActivityIndicator size={responsiveHeight(4)} color={'white'} />
        else
            btnDisplay = <Text style={Styles.btnTxt}>SIGN UP</Text>

        let marker;
        if (this.state.marker)
            marker = <Marker coordinate={this.state.marker} />
        return (
            <SafeAreaView style={Styles.MainContainer}>
                <StatusBar backgroundColor="#b8b8b8" barStyle="light-content" />
                <ImageBackground source={require('../../Images/background.jpg')} style={Styles.backgroundImage}>

                    <View style={Styles.BackgroundBlur}>
                        <Card style={Styles.SignUpCard}>
                            <LinearGradient start={{ x: 0, y: 1 }} end={{ x: 1, y: 0 }} colors={['#e5e5e5', '#b8b8b8', '#e5e5e5']} style={Styles.CardStyle}>
                                <Text style={Styles.HearderText}>Shop Details</Text>

                                <View style={Styles.AvatarImage}>
                                    <Text style={Styles.ImageText}>Tap To Add Images</Text>
                                    <TouchableOpacity style={Styles.ProductImagesCard} activeOpacity={0.5} onPress={this.SelectImage}>
                                        <View>
                                            {
                                                this.state.avatarSource && <Image source={{ uri: this.state.avatarSource }} style={{ height: responsiveHeight(15), width: responsiveWidth(45), justifyContent: 'center', alignSelf: 'center', borderWidth: 4, borderColor: 'white' }} />
                                            }
                                        </View>
                                        <View style={{ opacity: this.state.opacity }}>
                                            <Image source={require('../../Images/product2.png')} style={Styles.AvtImageStyle} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={Styles.ImageView}>
                                    <View style={{ height: responsiveHeight(7), width: responsiveWidth(75), flexDirection: 'row', }}>
                                        <Image
                                            source={require('../../Images/user.png')}
                                            style={Styles.ImageStyle}
                                        />
                                        <TextInput
                                            style={Styles.inputField}
                                            placeholder='Enter ShopName'
                                            underlineColorAndroid="transparent"
                                            onChangeText={text => this.validate(text, "ShopName")}
                                            value={this.state.ShopName}
                                        />
                                    </View>
                                    < Text style={Styles.error}>
                                        {this.state.errfn}
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
                                            onChangeText={text => this.validate(text, "ShopNumber")}
                                            value={this.state.ShopNumber}
                                        />
                                    </View>
                                    < Text style={Styles.error}>
                                        {this.state.errfn}
                                    </Text>
                                </View>

                                <View style={Styles.ImageView}>
                                    <View style={{ height: responsiveHeight(7), width: responsiveWidth(75), flexDirection: 'row', }}>

                                        <TextInput
                                            style={Styles.inputField}
                                            placeholder='Shop Discription'
                                            keyboardType='default'
                                            underlineColorAndroid="transparent"
                                            multiline={true}
                                            onChangeText={text => this.validate(text, "Discription")}
                                            value={this.state.Discription}
                                        />
                                    </View>
                                    < Text style={Styles.error}>
                                        {this.state.errfn}
                                    </Text>
                                </View>

                                <View>
                                    <TouchableOpacity
                                        style={Styles.ButtonMap}
                                        onPress={() => {
                                            this.setState({ visible: true });
                                        }}
                                    >
                                        <Text style={{ textAlign: 'center', fontSize: responsiveFontSize(2.4), color: 'white', fontWeight: 'bold', }}>Show Map</Text>
                                    </TouchableOpacity>
                                    <Dialog
                                        visible={this.state.visible}
                                        footer={
                                            <DialogFooter >
                                                <DialogButton
                                                    text="CANCEL"
                                                    onPress={
                                                        this.toggleModal
                                                    }
                                                    style={[Styles.btn, { backgroundColor: '#DB4437' }]}
                                                />
                                                <DialogButton
                                                    text="OK"
                                                    onPress={this.selectLocation} style={[Styles.btn, { backgroundColor: '#4285F4' }]}
                                                />
                                            </DialogFooter>
                                        }
                                    >
                                        <DialogContent style={Styles.DialogCard}>
                                            <View style={Styles.Mapcontainer}>

                                                <MapView
                                                    style={Styles.MapStyle}
                                                    provider={PROVIDER_GOOGLE}
                                                    ref={map => this._map = map}
                                                    showsUserLocation={true}
                                                    followsUserLocation={true}
                                                    showsMyLocationButton={true}
                                                    showsPointsOfInterest={true}
                                                    showsCompass={false}
                                                    initialRegion={this.state.initialPosition}
                                                    loadingEnabled={true}
                                                    loadingIndicatorColor={'red'}
                                                    onPress={coords => this.setState({ marker: coords.nativeEvent.coordinate })}

                                                >
                                                    {marker}
                                                </MapView>

                                                <View style={Styles.btnContainer}>
                                                    <Text style={Styles.MapTextStyle}>Tap On screen To Set Location</Text>
                                                </View>

                                            </View>
                                        </DialogContent>
                                    </Dialog>
                                </View>

                                <TouchableOpacity
                                    style={Styles.SignUpBtn}
                                    onPress={this.goToLogin}
                                    disabled={this.state.btnDisabled}
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
    // Card Styles //
    SignUpCard: {
        height: responsiveHeight(80),
        width: responsiveWidth(85),
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 20
    },
    CardStyle: {
        height: responsiveHeight(80),
        width: responsiveWidth(85),
        borderRadius: 20
    },

    HearderText: {
        justifyContent: 'flex-start',
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        width: responsiveWidth(50),
        color: 'white',
        top: 10
    },

    // Avatar Styles //
    AvatarImage: {
        height: responsiveHeight(25),
        width: responsiveWidth(55),
        top: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 100,
        alignSelf: 'center'
    },
    ImageText: {
        fontSize: responsiveFontSize(1.8),
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color: 'white'
    },
    AvtImageStyle: {
        alignSelf: 'center',
        top: 20,
        height: responsiveHeight(15),
        width: responsiveWidth(31),
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
        height: responsiveHeight(6),
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

    // Map Styling //
    DialogCard: {
        height: responsiveHeight(60),
        width: responsiveWidth(80),
        textAlign: 'center',
    },
    Mapcontainer: {
        height: responsiveHeight(60),
        width: responsiveWidth(100),
        ...StyleSheet.absoluteFillObject,
        textAlign: 'center',
    },
    MapStyle: {
        height: responsiveHeight(60),
        width: responsiveWidth(100),
        ...StyleSheet.absoluteFillObject,
    },
    btnContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        height: responsiveHeight(8),
        justifyContent: 'space-between',
    },
    btn: {
        alignSelf: 'center',
        borderWidth: responsiveWidth(0.1),
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#a3a3a3',
    },
    btnTxt: {
        color: 'white',
        fontWeight: 'bold'
    },
    MapTextStyle: {
        marginLeft: 50,
        flex: 1,
        color: 'black',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
    ButtonMap: {
        alignSelf: 'center',
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        borderRadius: 15,
        color: 'white',
        justifyContent: 'center',
        textAlign: 'center',
        backgroundColor: '#a6a6a6',
        opacity: 0.5,
        top: 60
    },
    SignUpBtn: {
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        borderRadius: 15,
        marginTop: 10,
        justifyContent: 'center',
        backgroundColor: '#a6a6a6',
        top: 60,
        alignSelf: 'center',
        opacity: 0.5
    },
    backButton: {
        height: responsiveHeight(6),
        width: responsiveWidth(60),
        justifyContent: 'center',
        alignSelf: 'center',
        top: 70,
        marginLeft: 50,
    },
    BtnText: {
        textAlign: 'center',
        fontSize: responsiveFontSize(2.4),
        color: 'black',
        fontWeight: 'bold',
    },
})