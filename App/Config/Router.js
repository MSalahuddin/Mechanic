import { createStackNavigator, DrawerNavigator } from 'react-navigation';
import {View, Text, Dimensions, Image, TouchableOpacity, TextInput,ScrollView, StyleSheet,AsyncStorage} from 'react-native'
import React, { Component } from 'react';
import MapScreen from './../Screen/MapScreen/Map'
import LoginScreen from './../Screen/Login/Login'
import SignUp from './../Screen/SignUp/SignUp'
const {width, height} = Dimensions.get('window');

const Route = createStackNavigator({
    LoginScreen: {screen: LoginScreen},
    MapScreen: { screen: MapScreen},
    SignUp: {screen: SignUp},

}, {
    headerMode: 'none'
});


export default Route
