import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, DeviceEventEmitter, Button, Alert, ActivityIndicator, AsyncStorage, recieverId, PermissionsAndroid} from 'react-native';
import MapScreen from "../MapScreen/Map";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {onLogin} from '../../redux/auth/action'
import firebase from 'react-native-firebase';

const db = firebase.firestore();
export default class Empty extends Component {

    componentWillMount(){
        const mechanicId = "JDquVawIckUaxAZNLhF6I5PXDMl2"
        db.collection('users').doc(mechanicId).update(
            {
                reviews:[{comment:"helloooo"}]
            }
        )
        //this.setAsyncData();
    }

    async setAsyncData(){
        let user = this.props.user;
        let userr = JSON.stringify(user);
        await AsyncStorage.setItem('user', userr);
    }
    render(){
        return(
            <View style = {{flex: 1, backgroundColor: '#4d4d4d',  justifyContent: 'center', alignItems: 'center'}}>
                <Text style = {{fontSize: 30, color: 'white'}}>Map Screen</Text>
            </View>
        )
    }
}