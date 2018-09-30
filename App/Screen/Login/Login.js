import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, Button, Alert, ActivityIndicator, AsyncStorage} from 'react-native';
import PhoneInput from 'react-native-phone-input';
import Styles from './Styles'
import {loginUser} from "../../Config/Firebase";
import MapScreen from "../MapScreen/Map";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {onLogin} from '../../redux/auth/action'

const {height, width} = Dimensions.get('window')

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
            loginLoader: false
        }
        this.login = this.login.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
    }

    componentWillMount(){
        this.autoLogin()
    }
    async autoLogin(){
        const value = await AsyncStorage.getItem('user');
        const user = JSON.parse(value);
        if(user){
            this.props.onLogin(user.user.id);
            console.log(user,'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuyyyyyyyyyyyyyyyyyyyyyyyyyy')
            this.props.navigation.navigate("MapScreen", {screen: "MapScreen"})
        }
    }
   async login(){
        const {phoneNo, loginLoader} = this.state;
        this.setState({loginLoader: true})
       setTimeout(()=>{
           if(!this.state.sendCode){
               Alert.alert('', "First create an account ")
               this.setState({loginLoader: false, phoneNo: '' })
           }
       },10000);
       let user = await loginUser(phoneNo);
       if(user){
           this.setState({sendCode: true, confirmResult: user, loginLoader: false, phoneNo: ''});
            Alert.alert('','Code send successfully')
       }
    }

    confirmCode(){
        const { codeInput, confirmResult } = this.state;
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
                .then((user) => {
                    this.props.onLogin(user._user.uid);
                    Alert.alert('', 'Code confirmed')
                    this.setState({codeInput: ''});
                    this.props.navigation.navigate("MapScreen", {screen: "MapScreen"})
                })
                .catch(error => {
                    Alert.alert('', 'Unconfirmed Code')
                    this.setState({codeInput: ''})
                });
        }
    }

    render(){
        return(
            <View>
                <View style={Styles.header}>
                    <Text style={Styles.headerText}>LOG IN</Text>
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
                    <View style={{width:width,height:height*0.2,alignItems:'center',justifyContent:'flex-end'}}>
                        <Text style={{fontWeight:'bold',fontSize:24,color:'#7085a5'}}>Online Mechanic</Text>
                    </View>
                    <View style={{borderRadius: 20, width:width * 0.8, height:height*0.25, backgroundColor:'#aaaeb5', opacity: 0.9, marginTop: height*0.08, marginLeft: width*0.1}}>
                        <View style={{width: width*0.8, height: height*0.16, paddingRight:20}}>
                            <View style={{marginTop: height * 0.02, marginLeft: height* 0.02}}>
                                <PhoneInput
                                    ref={ref => {
                                        this.phone = ref;
                                    }}
                                    initialCountry={'pk'}
                                    value = {this.state.phoneNo}
                                    flagStyle={{width: 40, height: 30, borderWidth:0}}
                                    textStyle={{fontSize:20}}
                                    textProps={{placeholder: 'Telephone number'}}
                                    onChangePhoneNumber={(text)=> this.setState({ phoneNo: text}) }
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=> this.login()}>
                            <View style={{width:width*0.8, height: height*0.09, backgroundColor:'#7085a5',alignItems: 'center',justifyContent:'center', borderBottomLeftRadius:20, borderBottomRightRadius: 20}}>
                                {this.state.loginLoader ?
                                    <ActivityIndicator size="small" color="#0000ff"/> :
                                    <Text style={{
                                        fontSize: 18,
                                        color: '#fff',
                                        fontFamily: 'monospace',
                                        fontWeight: 'bold'
                                    }}>Login</Text>
                                }
                                    </View>
                        </TouchableOpacity>
                    </View>

                    <View style={Styles.footer}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("SignUp", {screen: "SignUp"})}>
                            <Text style={Styles.footerText}>
                                Don't you have an account! Signup
                            </Text>
                        </TouchableOpacity>
                    </View>
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