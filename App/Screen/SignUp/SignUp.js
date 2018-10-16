import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, Button, Alert, ScrollView, ActivityIndicator} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebase from 'react-native-firebase';
import Styles from "./Styles";
import LoginScreen from "../Login/Login";
import {signUp} from './../../Config/Firebase'

const db = firebase.firestore()
const {height, width} = Dimensions.get('window')

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
            signupLoader: false
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
        let signupUser = await signUp(phoneNo)
            if(signupUser){
                this.setState({sendCode: true,confirmResult: signupUser, signupLoader: false})
                Alert.alert('','Code send successfully')
            }
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
                        profilePicture: ''
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

    render(){
        return(
            <View>
                <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}} enableOnAndroid={true} >
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
                {this.state.sendCode ?
                    <View style={{width: width, height: height* 0.3, marginTop: height* 0.3}}>
                        <Text style={{fontSize:20}}>{this.state.message}</Text>
                        <TextInput
                            style = {{color:'black'}}
                            placeholder = 'XXXXXX'
                            secureTextEntry = {false}
                            value = {this.state.codeInput}
                            onChangeText={(text)=>this.setState({codeInput:text})}
                            keyboardType="numeric"
                        />
                        <Button title="Confirm Code" color="#841584" onPress={()=> this.confirmCode()} />
                    </View>
                    :
                    <View>
                        <View style={{borderRadius: 20, width:width * 0.8, height:height*0.74, backgroundColor:'#aaaeb5', opacity: 0.9, marginTop: height*0.02, marginLeft: width*0.1}}>
                            <View style={{width: width*0.8, height: height*0.65, paddingRight:20, marginLeft: width * 0.04}}>
                                <ScrollView>
                                    <View>
                                        <View>
                                            <TextInput
                                                underlineColorAndroid = 'transparent'
                                                placeholder= 'First Name'
                                                value={this.state.firstName}
                                                style={Styles.inputField}
                                                onChangeText = {(text)=> this.setState({firstName: text})}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                underlineColorAndroid = 'transparent'
                                                placeholder= 'Last Name'
                                                value={this.state.lastName}
                                                style={Styles.inputField}
                                                onChangeText = {(text)=> this.setState({lastName: text})}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                underlineColorAndroid = 'transparent'
                                                placeholder= 'Email'
                                                value={this.state.email}
                                                style={Styles.inputField}
                                                onChangeText = {(text)=> this.setState({email: text})}
                                            />
                                        </View>
                                        <View onLayout={(e)=> {
                                            footerY = e.nativeEvent.layout.y;
                                        }}>
                                            <TextInput
                                                underlineColorAndroid = 'transparent'
                                                keyboardType = 'numeric'
                                                placeholder= 'Mobile no'
                                                value={this.state.phoneNo}
                                                style={Styles.inputField}
                                                maxLength={13}
                                                onChangeText = {(text)=> this.setState({phoneNo: text})}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                underlineColorAndroid = 'transparent'
                                                placeholder= 'Password'
                                                value={this.state.password}
                                                secureTextEntry={true}
                                                style={Styles.inputField}
                                                onChangeText = {(text)=> this.setState({password: text})}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                underlineColorAndroid = 'transparent'
                                                placeholder= 'Re-type password'
                                                value={this.state.retypePass}
                                                secureTextEntry={true}
                                                style={Styles.inputField}
                                                onChangeText = {(text)=> this.setState({retypePass: text})}
                                            />
                                        </View>
                                        <View>
                                            <TextInput
                                                multiline={true}
                                                numberOfLines={4}
                                                blurOnSubmit={false}
                                                underlineColorAndroid = 'transparent'
                                                placeholder= 'Description'
                                                value={this.state.description}
                                                secureTextEntry={false}
                                                style={Styles.inputField}
                                                onChangeText = {(text)=> this.setState({description: text})}
                                            />
                                        </View>
                                    </View>
                                </ScrollView>
                            </View>
                            <TouchableOpacity onPress = {()=>this.userSignUp()}>
                                <View style = {{width:width*0.8, height: height*0.09, backgroundColor:'#7085a5',alignItems: 'center',justifyContent:'center', borderBottomLeftRadius:20, borderBottomRightRadius: 20}}>
                                    {this.state.signupLoader ?
                                        <ActivityIndicator size="small" color="#0000ff"/> :
                                        <Text style = {{fontSize:18, color:'#fff', fontFamily : 'monospace', fontWeight: 'bold'}}>SignUp</Text>
                                    }
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={Styles.footer}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate("LoginScreen", {screen: "LoginScreen"})}>
                                <Text style={Styles.footerText}>Back to login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                </KeyboardAwareScrollView>
            </View>
        )
    }
}