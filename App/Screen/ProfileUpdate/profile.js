import React, {Component} from 'react';
import {View, Text, Dimensions, Image, Button, TouchableOpacity, TextInput,ScrollView, StyleSheet,ActivityIndicator,Alert} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet'
import { connect } from 'react-redux'
import Styles from './Styles'
import { TextField } from 'react-native-material-textfield';
import CheckBox from 'react-native-modest-checkbox'
var ImagePicker = require('react-native-image-picker');
import {uploadImage, updateProfile} from "../../Config/Firebase";

const {width, height} = Dimensions.get('window');

class Profile extends Component{

    constructor(props){
        super(props);
        this.state = {
            firstName : this.props.user.firstName,
            lastName : this.props.user.lastName,
            email : this.props.user.email,
            loader : false,
            role : '',
            mobile: this.props.user.phoneNo,
            profileImg : this.props.user.profilePicture || '',
            loader : false,
            isMechanic: this.props.user.isMechanic,
            sendCode: false,
            confirmResult:null,
        };
        this._onOpenActionSheet = this.onOpenActionSheet.bind(this);

    }

    onOpenActionSheet = () => {
        this.ActionSheet.show()
    };


    async openCamera(get){
        let options  = {
            allowsEditing: true,
            aspect: [3, 3],
            noData : true
        };
        let result;
        if(get == 0){
            ImagePicker.launchImageLibrary(options, (response)  => {
                this.setState({profileImg : response.uri})
            });
        }else if(get == 1){
            ImagePicker.launchCamera(options, (response)  => {
                this.setState({profileImg : response.uri})
            });
        }


    }


    async updateProfile(){

        const {firstName, lastName,email, profileImg } = this.state;
        try {
            this.setState({loader: true});
            const imageRes = await uploadImage(this.props.user.id, profileImg);
            console.log(imageRes,'//////////////////////////////////////')
           let res = await updateProfile(this.props.user.id, {firstName: firstName, lastName: lastName, email: email, profilePicture: imageRes});
            Alert.alert('',res);
            this.setState({loader: false});

        } catch (e) {
            this.setState({loader: false});
            Alert.alert("Error")
        }
    }

    inputFields(){
        return(
            <View style={{width: width, alignItems:'center', justifyContent: 'center'}}>
                <View style={Styles.inputField}>
                    <TextField
                        label='First Name'
                        value={this.state.firstName}
                        onChangeText= {(text)=> this.setState({firstName: text})}
                        style={{ fontFamily: 'Lato-Regular' }}
                    />
                </View>
                <View style={Styles.inputField}>
                    <TextField
                        label='Last Name'
                        value={this.state.lastName}
                        onChangeText= {(text)=> this.setState({lastName: text})}
                        style={{ fontFamily: 'Lato-Regular' }}
                    />
                </View>
                <View style={Styles.inputField}>
                    <TextField
                        label='Email'
                        value={this.state.email}
                        onChangeText= {(text)=> this.setState({email: text})}
                        style={{ fontFamily: 'Lato-Regular' }}
                    />
                </View>
                <View style={Styles.inputField}>
                    <TextField
                        label='Mobile no'
                        value={this.state.mobile}
                        editable = {false}
                        keyboardType = 'numeric'
                        onChangeText= {(text)=> this.setState({mobile: text})}
                        style={{ fontFamily: 'Lato-Regular' }}
                        characterRestriction = {13}
                    />
                </View>
                <View style = {{width: width, height: height * 0.05, marginTop: height * 0.05, flexDirection: 'row'}}>
                    <CheckBox
                        containerStyle = {{marginLeft: width * 0.15}}
                        label='Mechanic'
                        checked = {this.state.isMechanic ? true : false}

                    />
                    <CheckBox
                        containerStyle = {{marginLeft: width * 0.15}}
                        label='User'
                        checked = {this.state.isMechanic ? false : true}
                    />
                </View>
            </View>
        )
    }
    render(){
        const {profileImg} = this.state;

        const options = [
            'Gallery',
            'Camera',
            'Cancel'

        ];

        return(
            <View style={Styles.main}>

                    <View style={Styles.sub}>
                        <KeyboardAwareScrollView innerRef={ref => {this.scroll = ref}} enableOnAndroid={true} >
                            <View style={Styles.headerMain}>
                                <View style={Styles.headerSub}>
                                    <View style={Styles.headerBack}>
                                        <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                                            <Image source={require('../../Images/leftArrow.png')} style={Styles.headerImg}/>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={Styles.headerHeading}>
                                        <Text style={Styles.headerText}>Update Profile</Text>
                                    </View>
                                </View>
                            </View>
                                <View style={Styles.subMain}>
                                    <View style={Styles.subSub}>
                                        <View style={Styles.profilePicCont}>
                                            <TouchableOpacity style={Styles.picSub} onPress={this._onOpenActionSheet}>

                                                <Image
                                                    source={profileImg ? {uri: profileImg} : require('./../../Images/profile.png')}
                                                    style={Styles.pic}/>

                                            </TouchableOpacity>
                                        </View>
                                        <View style={Styles.formMain}>

                                            <View>
                                                {this.inputFields()}
                                            </View>


                                        </View>
                                        <View style={Styles.footerMain}>
                                            <TouchableOpacity onPress={()=>{this.updateProfile()}}
                                                              style={Styles.btn}>
                                                {this.state.loader ? <ActivityIndicator size="small" color="#0000ff"/> :
                                                    <Text style={Styles.btnText}>Update Profile</Text>}
                                            </TouchableOpacity>
                                        </View>
                                        <View style={Styles.footerMain}>
                                            <TouchableOpacity
                                                onPress={() => this.props.navigation.navigate("UpdatePassword", {screen: "UpdatePassword"})}
                                                style={Styles.btn2}>
                                                <Text style={Styles.footerText}>For password update</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                        </KeyboardAwareScrollView>

                    </View>
                <View>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={<Text style={{color: '#000', fontSize: 18}}>Which one do you like?</Text>}
                        options={options}
                        cancelButtonIndex={2}
                        destructiveButtonIndex={2}
                        onPress={(option) => {this.openCamera(option)}}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(
    mapStateToProps
)(Profile)

