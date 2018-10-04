import React, {Component} from 'react';
import {View, Text, Dimensions, Image, TouchableOpacity,TextInput,ActivityIndicator,Alert} from 'react-native'
import Styles from './Styles'
import { TextField } from 'react-native-material-textfield';

const {width, height} = Dimensions.get('window');

export default class UpdatePassword extends Component{

    constructor(props){
        super(props);
        this.state = {
            OldPassword: '',
            NewPassword: '',
            ReType: '',
            loader : false
        };

    }

    validate() {
        const {OldPassword, NewPassword,ReType} = this.state;
        if (!OldPassword || !NewPassword ) {
            Alert.alert('','Enter All Fields.');
            return false;
        } else if (NewPassword.length < 8) {
            Alert.alert('','Minimum length of password field is 8 characters');
            return false;
        } else if (NewPassword.length > 16) {
            Alert.alert('','Maximum length of password field is 16 characters');
            return false;
        }
        else if (NewPassword != ReType) {
            Alert.alert('','Passwords do not match.');
            return false;
        }
        return true;
    }

    async updatePassword() {

        const {OldPassword, NewPassword, ReType} = this.state;
        if (this.validate()) {
            try {
                this.setState({loader: true});
                await updatePassword(OldPassword, NewPassword);
                this.setState({loader : false , OldPassword : '', NewPassword : '', ReType : ''})
            } catch (e) {
                this.setState({loader : false});
                Alert.alert('', e.error)
            }
        }
    }


    render(){

        return(
            <View style={Styles.main}>
                <View style={Styles.sub}>

                    <View style={Styles.headerMain2}>
                        <View style={Styles.headerSub}>
                            <View style={Styles.headerBack}>
                                <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                                    <Image source={require('../../Images/leftArrow.png')} style={Styles.headerImg}/>
                                </TouchableOpacity>
                            </View>
                            <View style={Styles.headerHeading}>
                                <Text style={Styles.headerText}>Update Password</Text>
                            </View>
                        </View>
                    </View>
                    <View style={Styles.subMain2}>
                        <View style={Styles.subSub}>

                            <View style={Styles.formMain2}>

                                <View style={{width: width, alignItems:'center', justifyContent: 'center'}}>
                                    <View style={Styles.inputField}>
                                        <TextField
                                            label='Old Password'
                                            value={this.state.OldPassword}
                                            secureTextEntry={true}
                                            onChangeText= {(text)=> this.setState({OldPassword: text})}
                                            style={{ fontFamily: 'Lato-Regular' }}
                                        />
                                    </View>

                                    <View style={Styles.inputField}>
                                        <TextField
                                            label='New Password'
                                            value={this.state.NewPassword}
                                            secureTextEntry={true}
                                            onChangeText= {(text)=> this.setState({NewPassword: text})}
                                            style={{ fontFamily: 'Lato-Regular' }}
                                        />
                                    </View>

                                    <View style={Styles.inputField}>
                                        <TextField
                                            label='Re-type Password'
                                            value={this.state.ReType}
                                            secureTextEntry={true}
                                            onChangeText= {(text)=> this.setState({ReType: text})}
                                            style={{ fontFamily: 'Lato-Regular' }}
                                        />
                                    </View>
                                </View>

                            </View>
                            <View style={Styles.footerMain2}>
                                <TouchableOpacity onPress={()=>{this.updatePassword()}} style={Styles.btn}>
                                    {this.state.loader ? <ActivityIndicator size="small" color="#0000ff" /> :  <Text style={Styles.btnText}>Update Password</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>

                </View>

            </View>
        )
    }
}

