import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, Button, Alert, ScrollView, ActivityIndicator} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'react-native-firebase';
import Styles from "./Styles";
import LoginScreen from "../Login/Login";
import {signUp} from './../../Config/Firebase'
import CountDown from 'react-native-countdown-component';

const db = firebase.firestore();
const {height, width} = Dimensions.get('window');

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

export default class SignUp extends Component{

    static navigationOptions = {
        header : null
    };

    constructor(props){
        super(props);
        this.unsubscribe = null;
        this.state = {
            firstName: '',
            lastName: '',
            phoneNo:'+92',
            email: '',
            password: '',
            retypePass: '',
            description: '',
            confirmResult:null,
            sendCode: false,
            codeInput: '',
            signupLoader: false,
            userExist: false,
            showResend: false
        }
        this.userSignUp = this.userSignUp.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
    }

    componentWillMount(){
        firebase.auth().signOut();
    }
   async userSignUp(){
        const {firstName, lastName, email, phoneNo, password, signupLoader } = this.state;
        this.setState({signupLoader: true})
        if(firstName === ''|| lastName === ''|| email === '' || password === '' || phoneNo === ''){
            this.setState({signupLoader: false})
            alert('Fill all the fields')
        }

        else{
            db.collection("users").where("phoneNo", "==", phoneNo).get()
                .then((res)=>{
                    if(res._docs[0]._data.phoneNo == phoneNo){
                        this.setState({userExist: true})
                    }
                })
                .catch((err)=>{
                });
            setTimeout(async () => {
              if(this.state.userExist) {
                  Alert.alert('',"Account already created");
                  this.setState({signupLoader: false})
              }
              else{
                  let signupUser = await signUp(phoneNo);
                  if (signupUser) {
                      this.setState({sendCode: true, confirmResult: signupUser, signupLoader: false})
                      Alert.alert('', 'Code send successfully')
                  }
              }

            }, 3000)
        }
    }

    confirmCode(){
        const { codeInput, confirmResult, firstName, lastName, email, phoneNo, password, description} = this.state;
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    db.collection('users').doc(user._user.uid).set({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        phoneNo: phoneNo,
                        createdAt: Date.now(),
                        description: description,
                        isMechanic: false,
                        id: user._user.uid,
                        profilePicture: '',
                        rating: []
                    })
                        .then((res)=>{
                            Alert.alert('','Successfully registered')
                            this.props.navigation.navigate("LoginScreen", {screen: "LoginScreen"})
                        })
                        .catch((error)=> {
                            console.log('Error Adding Data', error)
                        })
                })
                .catch(error => {
                    Alert.alert('','Error')
                });
        }
    }

    renderHeader = () => {
        return(
            <View style = {{width: width * 0.325,
                                             height: width * 0.325,
                                        marginTop: height * 0.05,
                                        justifyContent: 'center',
                                        borderColor: '#ff8c00',
                                        borderRadius: 100,
                                        alignItems: 'center',
                                        borderWidth: 2}}>
                <Image style = {{
                                             width: width * 0.32,
                                             height: width * 0.32
                                             }}
                       resizeMode = 'contain'
                       source = {require('../../Images/profile_placeholder.png')}/>

            </View>
        )
    }

    renderSeperator = () => {
        return <View style={Styles.seperator} />;
    };


    renderFirstName = () => {
        return(

                <TextInput
                    {...textFieldPropsObject}
                    numberOfLines={1}
                    placeholder= 'First Name'
                    value={this.state.firstName}
                    onChangeText = {(text)=> this.setState({firstName: text})}
                    style={Styles.inputField}

                />

        )
    }

    renderLastName = () => {
        return(
                <TextInput
                    {...textFieldPropsObject}
                    numberOfLines={1}
                    placeholder= 'Last Name'
                    value={this.state.lastName}
                    style={Styles.inputField}
                    onChangeText = {(text)=> this.setState({lastName: text})}
                />
        )
    }

    renderMobileNumber = () => {
        return(
            <TextInput
                {...textFieldPropsObject}
                numberOfLines={1}
                keyboardType={"phone-pad"}
                placeholder= 'Mobile no'
                value={this.state.phoneNo}
                style={Styles.inputField}
                maxLength={13}
                onChangeText = {(text)=> this.setState({phoneNo: text})}
            />
        )
    }

    renderPassword = () => {
        return(
            <TextInput
                {...textFieldPropsObject}
                numberOfLines={1}
                placeholder= 'Password'
                value={this.state.password}
                secureTextEntry={true}
                style={Styles.inputField}
                onChangeText = {(text)=> this.setState({password: text})}
            />
        )
    }

    renderRetypPassword = () => {
        return(
            <TextInput
                {...textFieldPropsObject}
                numberOfLines={1}
                placeholder= 'Re-type password'
                value={this.state.retypePass}
                secureTextEntry={true}
                style={Styles.inputField}
                onChangeText = {(text)=> this.setState({retypePass: text})}
            />
        )
    }

    renderEmail = () => {
        return(
            <TextInput
                {...textFieldPropsObject}
                numberOfLines={2}
                keyboardType={"email-address"}
                placeholder= 'Email'
                value={this.state.email}
                style={Styles.inputField}
                onChangeText = {(text)=> this.setState({email: text})}
            />
        )
    }

    renderSignupButton = () => {
        return(
            <TouchableOpacity onPress={()=> this.userSignUp()}>
                <View style={Styles.signupButton}>
                    {this.state.signupLoader ?
                        <ActivityIndicator size="small" color="#0000ff"/> :
                        <Text style={{
                                fontSize: 18,
                                color: 'white',
                                fontFamily: 'monospace',
                                fontWeight: 'bold'
                                }}>
                            SignUp
                        </Text>
                    }
                </View>
            </TouchableOpacity>
        )
    }

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

    resetTimer = () => {
        this.setState({ showResend: false });
        setTimeout(() => {
            this.setState({ showResend: true });
        }, 30000);
    };

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

    render(){
        const {sendCode} = this.state;
        return(
            <View style = {{flex: 1, backgroundColor: '#4d4d4d'}}>
                    <View style={Styles.header}>
                        <View style={Styles.headerSub}>
                            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                                <Image source={require('../../Images/leftArrow.png')} style={Styles.headerImg}/>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.headingDiv}>
                            <Text style={Styles.headingText}>Create an Account</Text>
                        </View>
                    </View>
                {sendCode ?
                    this.renderVerificationCode()
                    :
                    <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}} enableOnAndroid={true} >
                        <View style = {{ alignItems: 'center', marginBottom: height * 0.05}}>
                        {this.renderHeader()}
                            <View style = {{marginTop: height* 0.01}}>
                                {this.renderFirstName()}
                                {this.renderSeperator()}
                                {this.renderLastName()}
                                {this.renderSeperator()}
                                {this.renderEmail()}
                                {this.renderSeperator()}
                                {this.renderMobileNumber()}
                                {this.renderSeperator()}
                                {this.renderPassword()}
                                {this.renderSeperator()}
                                {this.renderRetypPassword()}
                                {this.renderSeperator()}
                                {this.renderSignupButton()}
                            </View>
                        </View>
                    </KeyboardAwareScrollView>

                }

            </View>
        )
    }
}