import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, DeviceEventEmitter, Button, Alert, ActivityIndicator, AsyncStorage, recieverId, PermissionsAndroid} from 'react-native';
import Styles from './Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {onLogin} from '../../redux/auth/action'
import CountDown from 'react-native-countdown-component';

class VerifyScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            showResend: false
        }
    }

    componentDidMount(){
        this.resetTimer()
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
                <Text style = {{color: 'orange', fontSize: 15, textAlign: 'center'}}>Resend SMS code in</Text>
                <CountDown
                    until={30}
                    size={20}
                    onFinish={() => alert("Finished")}
                    digitStyle={{ backgroundColor: 'grey' }}
                    digitTxtStyle={{ color: 'orange' }}
                    timeLabelStyle={{ color: 'orange' }}
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
                    placeholderTextColor = 'orange'
                    selectionColor = 'orange'
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
                        style = {{color: 'orange', fontSize: 15, textAlign: 'center'}}>Resend SMS code</Text>
                    :
                    this.renderCountDown()
                }
            </View>
        )
    }

    render(){
        return(
            <View style={{flex: 1}}>
                {this.renderVerificationCode()}
            </View>
        )
    }
}

export default {VerifyScreen};