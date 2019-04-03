import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, DeviceEventEmitter, Button, Alert, ActivityIndicator, AsyncStorage, recieverId, PermissionsAndroid} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import Styles from './Styles'
import {loginUser} from "../../Config/Firebase";
import MapScreen from "../MapScreen/Map";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {onLogin} from '../../redux/auth/action'
import CountDown from 'react-native-countdown-component';

const {height, width} = Dimensions.get('window')
const textFieldPropsObject = {
    // textAlign: "center",
    selectionColor: "#e89225",
    underlineColorAndroid: "transparent",
    style: [Styles.input],
    placeholderTextColor: 'white',
    returnKeyType: "next",
    enablesReturnKeyAutomaticallly: true
    // multiline: true,
    // numberOfLines: 1
};

class LoginScreen extends Component{
    static navigationOptions = {
        header : null
    };

    constructor(props){
        super(props);
        this.state = {
            phoneNo: '',
            sendCode: false,
            codeInput: '',
            confirmResult:null,
            loginLoader: false,
            showResend: false,
            loginConfirmed: false
        }
        this.login = this.login.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
    }

    componentWillMount(){
        this.autoLogin()
        this.getPermission();
        this.resetTimer();
    }
    async getPermission() {
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
            ok: "YES",
            cancel: "NO",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
            preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
            providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
        })

        DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
            console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
        });
    }
    async autoLogin(){
        const value = await AsyncStorage.getItem('user');
        const user = JSON.parse(value);
        if(user){
            this.props.onLogin(user.id);
            setTimeout(()=>{
                this.props.navigation.navigate("MapScreen", {screen: "MapScreen"})
            },3000)
        }
    }
   async login(){
        const {phoneNo, loginLoader} = this.state;
        this.setState({loginLoader: true});
       setTimeout(()=>{
           if(!this.state.loginConfirmed){
               Alert.alert('', "First create an account ")
               this.setState({loginLoader: false, phoneNo: '' })
           }
       },10000);
       let user = await loginUser(phoneNo);
       if(user){
           this.setState({loginLoader: false, phoneNo: '', loginConfirmed: true});
           user && user._docs[0] && user._docs[0]._data.id && this.props.onLogin(user._docs[0]._data.id);
           setTimeout(()=>{
               //this.props.navigation.navigate("Empty", {screen: "Empty"})
               this.props.navigation.navigate("MapScreen", {screen: "MapScreen"})
           },3000)
       }
       //if(user){
       //    this.setState({sendCode: true, confirmResult: user, loginLoader: false, phoneNo: ''});
       //     Alert.alert('','Code send successfully')
       //}
    }

    confirmCode(){
        const { codeInput, confirmResult } = this.state;
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    this.props.onLogin(user._user.uid);
                    Alert.alert('', 'Code confirmed')
                    this.setState({codeInput: ''});
                    setTimeout(()=>{
                        //this.props.navigation.navigate("Empty", {screen: "Empty"})
                        this.props.navigation.navigate("MapScreen", {screen: "MapScreen"})
                    },3000)
                })
                .catch(error => {
                    Alert.alert('', 'Unconfirmed Code')
                    this.setState({codeInput: ''})
                });
        }
    }

    resetTimer = () => {
        this.setState({ showResend: false });
        setTimeout(() => {
            this.setState({ showResend: true });
        }, 30000);
    };


    renderCountDown = () => {
        return(
            <View>
                <Text style = {{color: '#ff8c00', fontSize: 15, textAlign: 'center'}}>Resend SMS code in</Text>
                <CountDown
                    until={30}
                    size={20}
                    onFinish={() => alert("Finished")}
                    digitStyle={{ backgroundColor: '#4d4d4d' }}
                    digitTxtStyle={{ color: 'white' }}
                    timeLabelStyle={{ color: '#ff8c00' }}
                    timeToShow={["S", "MS"]}
                />

            </View>
        )
    }

    renderVerificationCode = () => {
        const  { showResend } = this.state;
        return(
            <View style={{flex: 1}}>
                <View style = {{width: width, height: height * 0.2, alignItems: 'center', marginTop: height * 0.1}}>
                    <Text style = {{color: 'white', fontSize: 18}}>Verification Code</Text>
                    <Text style = {{color: 'white', fontSize: 13, marginTop: height * 0.1}}>Please enter verification code </Text>
                    <Text style = {{color: 'white', fontSize: 13}}>sent to {this.state.phoneNo}</Text>
                </View>
                <TextInput
                    {...textFieldPropsObject}
                    underlineColorAndroid={"transparent"}
                    placeholderTextColor = '#ff8c00'
                    selectionColor = '#ff8c00'
                    maxLength={6}
                    returnKeyType="done"
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    style = {Styles.codeInput}
                    placeholder={"_ _ _ _ _ _"}
                    secureTextEntry = {false}
                    value = {this.state.codeInput}
                    onChangeText={(text)=>this.setState({codeInput:text})}
                    onSubmitEditing={() => this.confirmCode()}
                    keyboardType="numeric"
                />
                {showResend ?
                    <Text
                        onPress = {() => this.resetTimer()}
                        style = {{color: '#ff8c00', fontSize: 15, textAlign: 'center'}}>Resend SMS code</Text>
                    :
                    this.renderCountDown()
                }
            </View>
        )
    }

    onChangePhoneNo = (text) => {
        const {phoneNo} = this.state;
        console.log(phoneNo.length,'kkkkkkkkkkkkkkkkkkkkkkkjjjjjjjjjjjjj')
        if(phoneNo.length < 13){
            this.setState({ phoneNo: text})
        }
    }

    render(){
        const  { sendCode } = this.state;
        return(
            <View style = {{flex: 1, backgroundColor: '#4d4d4d'}}>
                <View style={Styles.header}>
                    {this.state.sendCode ?
                        <Text style={Styles.headerText}>Enter Verification Code</Text>
                        :
                        <Text style={Styles.headerText}>LOG IN</Text>
                    }
                </View>
                {sendCode ?
                    this.renderVerificationCode()
                :
                <View>
                    <View style={{width:width,height:height*0.2,alignItems:'center',justifyContent:'flex-end'}}>
                        <Text style={{fontWeight:'bold',fontSize:24,color:'white'}}>AutoResque</Text>
                    </View>

                          <PhoneInput
                              ref={ref => {
                                   this.phone = ref;
                                  }}
                              initialCountry={'pk'}
                              value = {this.state.phoneNo}
                              flagStyle={{width: 40, height: 30, borderWidth:0, marginLeft: width * 0.03}}
                              textStyle={{fontSize:20}}
                              style = {Styles.phoneInput}
                              textProps={{placeholder: 'Telephone number'}}
                              onChangePhoneNumber={(text)=> this.onChangePhoneNo(text) }
                          />



                    <View style={Styles.footer}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp", {screen: "SignUp"})}>
                            <Text style={Styles.footerText}>
                                Don't you have an account! Signup
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={()=> this.login()}>
                        <View style={Styles.loginBtn}>
                            {this.state.loginLoader ?
                                <ActivityIndicator size="small" color="#800000"/> :
                                <Text style={{
                                        fontSize: 18,
                                        color: 'white',
                                        fontFamily: 'monospace',
                                        fontWeight: 'bold'
                                    }}>Login</Text>
                            }
                        </View>
                    </TouchableOpacity>

                </View>
                }
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        onLogin: onLogin
    }, dispatch)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen)