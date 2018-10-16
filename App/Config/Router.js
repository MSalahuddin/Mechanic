import { createStackNavigator, DrawerNavigator } from 'react-navigation';
import {View, Text, Dimensions, Image, TouchableOpacity, TextInput,ScrollView, StyleSheet,AsyncStorage} from 'react-native'
import React, { Component } from 'react';
import MapScreen from './../Screen/MapScreen/Map'
import LoginScreen from './../Screen/Login/Login'
import SignUp from './../Screen/SignUp/SignUp'
import Profile from './../Screen/ProfileUpdate/profile'
import UpdatePassword from './../Screen/ProfileUpdate/UpdatePassword'
import { connect } from 'react-redux'
import {signOut} from './Firebase'
import firebase from 'react-native-firebase';


const {width, height} = Dimensions.get('window');
const db = firebase.firestore();

class DrawerDisplay extends Component{
    static navigationOptions = {
        header : null
    };
    constructor(props){
        super(props);
        this.state = {
            user: this.props.user ? this.props.user: ''
        }
    }

    async signOut(){
        let user = this.state.user;
        let id = user.id;
        let res = await signOut(id)
        console.log(res,'ppppppppppppppppppp');
        await AsyncStorage.setItem('user', '');
        firebase.auth().signOut();
        this.props.navigation.navigate("LoginScreen", {screen: "LoginScreen"})
    }


    render(){
        console.log(this.state.user,'userrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
        return(
            <View style={{flex: 1,flexDirection: 'column'}}>

                <View style={{height: height*0.25,borderWidth:0.5,borderBottomColor:'grey',borderLeftColor:'transparent',borderRightColor:'transparent',borderTopColor:'transparent'}}>
                    <View style={{height : height*0.15,alignItems:'center',justifyContent:'center'}}>
                        <View style={{height:height*0.12, width:height*0.12,borderRadius:100,alignItems:'center',justifyContent:'center', borderWidth:1,borderColor:'grey'}}>

                            {this.state.user && this.state.user.profilePicture ?
                                <Image source={{uri:this.state.user.profilePicture}} style={{width:60,height:60,borderRadius : 100}}/>:
                                <Image source={require('../Images/profile.png')} style={{width:60,height:60,borderRadius : 100}}/>
                            }

                        </View>
                    </View>
                    <View style={{height:height*0.03,alignItems:'center',justifyContent:'center'}}>
                        <Text style={{fontSize:16, fontFamily: 'gt-walsheim-regular'}}>{this.state.user && this.state.user.firstName + " " + this.state.user.lastName}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate("Profile", {screen: "Profile"})}>
                    <View style={{height: height*0.1,borderWidth:0.5,borderBottomColor:'grey',borderTopColor:'transparent',borderLeftColor:'transparent',borderRightColor:'transparent'}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{width: width*0.15,alignItems:'center',justifyContent:'center'}}>
                                <Image source={require('../Images/profile.png')} style={{width:25,height:25}}/>
                            </View>
                            <View style={{width: width*0.5,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:15, fontFamily: 'gt-walsheim-regular'}}>Profile</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{this.signOut()}}>
                    <View style={{height: height*0.1,borderWidth:0.5,borderBottomColor:'grey',borderTopColor:'transparent',borderLeftColor:'transparent',borderRightColor:'transparent'}}>
                        <View style={{flex: 1, flexDirection: 'row'}}>
                            <View style={{width: width*0.15,alignItems:'center',justifyContent:'center'}}>
                                <Image source={require('../Images/logout.png')} style={{width:25,height:25}}/>
                            </View>
                            <View style={{width: width*0.5,alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:15,fontFamily: 'gt-walsheim-regular'}}>Logout</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

const ContentComponent = connect(mapStateToProps)(DrawerDisplay);

const DrawerNavigatorConfig =  {
    drawerWidth: 280,
    drawerPosition: 'Left',
    contentComponent: ContentComponent
    // props =>
    ,

    contentOptions: {
        activeBackgroundColor: 'white',
        activeTintColor: 'white',
        inactiveTintColor: '#032456',
        inactiveBackgroundColor: 'transparent'
    }

};

const DrawerNav = DrawerNavigator({

    MapScreen: {screen: MapScreen,},
    Profile:{screen: Profile},
    UpdatePassword: {screen: UpdatePassword}


}, DrawerNavigatorConfig);

const Route = createStackNavigator({
    LoginScreen: {screen: LoginScreen},
    DrawerNav: {screen: DrawerNav},
    SignUp: {screen: SignUp},

}, {
    headerMode: 'none'
});


export default Route
