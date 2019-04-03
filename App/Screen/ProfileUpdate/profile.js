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
            selectedItems: []
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

            </View>
        )
    }

    renderHeader = () => {
        const {profileImg} = this.state;
        return(
            <TouchableOpacity onPress={this._onOpenActionSheet}
                              style = {{width: width * 0.325,
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
                       resizeMethod = 'auto'
                       source = {profileImg ? {uri: profileImg} : require('../../Images/profile_placeholder.png')}/>

            </TouchableOpacity>
        )
    };

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
    };

    renderLastName = () => {
        return(

            <TextInput
                {...textFieldPropsObject}
                numberOfLines={1}
                placeholder= 'Last Name'
                value={this.state.lastName}
                onChangeText = {(text)=> this.setState({lastName: text})}
                style={Styles.inputField}

            />

        )
    };

    renderEmail = () => {
        return(

            <TextInput
                {...textFieldPropsObject}
                numberOfLines={1}
                placeholder= 'Email'
                value={this.state.email}
                onChangeText = {(text)=> this.setState({email: text})}
                style={Styles.inputField}

            />

        )
    };

    renderMobileNo = () => {
        return(

            <TextInput
                {...textFieldPropsObject}
                numberOfLines={1}
                placeholder= 'Mobile No'
                value={this.state.mobile}
                onChangeText = {(text)=> this.setState({mobile: text})}
                style={Styles.inputField}

            />

        )
    };

    renderCheckBoxes = () => {
        return(
            <View style = {{width: width * 0.8, height: height * 0.05, marginTop: height * 0.05, flexDirection: 'row'}}>
                <CheckBox
                    label='Mechanic'
                    labelStyle = {{color: 'white'}}
                    checked = {this.state.isMechanic ? true : false}

                />
                <CheckBox
                    containerStyle = {{marginLeft: width * 0.2}}
                    checkboxStyle = {{color: 'white'}}
                    labelStyle = {{color: 'white'}}
                    label='User'
                    checked = {this.state.isMechanic ? false : true}
                />
            </View>
        )
    };

    renderButton = () => {
        return(
            <View style={Styles.footerMain}>
                <TouchableOpacity onPress={()=>{this.updateProfile()}}
                                  style={Styles.btn}>
                    {this.state.loader ? <ActivityIndicator size="small" color="#0000ff"/> :
                        <Text style={Styles.btnText}>Update Profile</Text>}
                </TouchableOpacity>
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
                            {this.renderMobileNo()}
                            {this.renderSeperator()}
                            {this.renderCheckBoxes()}
                        </View>
                        {this.renderButton()}
                    </View>
                </KeyboardAwareScrollView>

                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={<Text style={{color: '#000', fontSize: 18}}>Which one do you like?</Text>}
                        options={options}
                        cancelButtonIndex={2}
                        destructiveButtonIndex={2}
                        onPress={(option) => {this.openCamera(option)}}
                    />
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

