import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform, Dimensions, ActivityIndicator, TouchableOpacity,AsyncStorage
} from 'react-native';
import {connect} from "react-redux";
import MapView, { Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import {filterMechanic, setDeviceToken, SetPosition, pushReq, remoteNotification} from './../../Config/Firebase'
import firebase from 'react-native-firebase';
import Styles from './Styles'
const haversine = require('haversine')
import MapViewDirections from 'react-native-maps-directions';

const {height, width} = Dimensions.get('window')


class MapScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            user: this.props.user,
            latitude: '',
            longitude: '',
            routeCoordinates: [],
            distanceTravelled: 0,
            prevLatLng: {},
            locSet: false,
            toggleInfo: false,
            onlineMecahics: [],
            allMechanics:[],
            markers: [],
            mechanicDetails:'',
            jobNotif: '',
            notifOpen: false,
            distOrigin: '',
            distDestination: ''

        }
        this.getDeviceToken = this.getDeviceToken.bind(this);
        this.getMechanicAndUser = this.getMechanicAndUser.bind(this);
    }

    componentWillMount(){
        this.getDeviceToken();
        this.getMechanicAndUser();
        this.setAsyncData();
    }
    async setAsyncData(){
        let user = this.props.user;
        let userr = JSON.stringify(user);
        await AsyncStorage.setItem('user', userr);
    }
    async setToken(token){
        let userId = this.props.user.id;
        let res = await setDeviceToken(userId, token);
    }

    async getDeviceToken(){
        const FCM = firebase.messaging();
        const fcmToken = FCM.getToken()
            .then((token)=>{
                this.setToken(token)
            })
    }

    async setPosition(latitude, longitude){
        let userId = this.props.user.id;
        let res = await SetPosition(userId, latitude, longitude);
    }

    async getMechanicAndUser(){
        const mechanic = await filterMechanic();
        const onlineMechanic = [];
        const user = this.props.user;
        const userObj = {};
        userObj.coordinates = {latitude: user.latitude, longitude: user.longitude};
        userObj.name = user.firstName + " " + user.lastName;
        userObj.description = user.description;
        userObj.id = user.id;
        userObj.token = user.deviceToken;
        userObj.image = user.profilePicture;

        let markers = [];
        mechanic.map((mech)=>{
            if(mech.deviceToken){
                onlineMechanic.push(mech);
                let obj = {};
                obj.coordinates = {latitude: mech.latitude , longitude: mech.longitude};
                obj.name = mech.firstName + " " + mech.lastName;
                obj.description = mech.description;
                obj.id = mech.id;
                obj.token = mech.deviceToken;
                obj.image = mech.profilePicture
                markers.push(obj);
            }
        });
        markers.push(userObj);
        this.setState({onlineMecahics: onlineMechanic, allMechanics: mechanic, markers: markers})
    }


    componentDidMount() {
       this.watchPosition()
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            const jobData = notification._data;
            const user = this.props.user;
            console.log(this.state.user,'uuuuuuuuuuuuuuiiiiiiiiiiiiiiiiii')
            console.log(jobData,'dsdddddddddddddddddddddddddddddddd')
            const destinationLogitude = parseFloat(jobData.longitude);
            const destinationLatitude = parseFloat(jobData.latitude);
            console.log(destinationLatitude)
            console.log(destinationLogitude,'.......................................')

            const origin = {latitude: 24.87217, longitude: 67.3529129};
            const destination = {latitude: destinationLatitude, longitude: destinationLogitude};
            const obj = {
                coordinates: {latitude: destinationLatitude , longitude: destinationLogitude},
                name: jobData.name,
                id: jobData.id,
                phoneNo: jobData.phoneNo
                }

            console.log(obj,'////////////////////////')
            notification._data && this.setState({jobNotif: obj, notifOpen: true, distOrigin: origin, distDestination: destination})
        });
    }

    watchPosition(){
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const {routeCoordinates, distanceTravelled } =   this.state;
                const { latitude, longitude } = position.coords;

                const newCoordinate = {
                    latitude,
                    longitude
                };
                this.setPosition(latitude, longitude);
                this.setState({
                    latitude,
                    longitude,
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled:
                    distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate,
                    locSet: true
                },()=>{
                    //setInterval(()=>{
                    //    this.setPosition(latitude, longitude)
                    //},5000)
                });
            },
            error => console.log(error),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    details(marker){
        this.setState({toggleInfo: true});
        this.setState({mechanicDetails: marker})
    }

    async pushRequest(){
        const  {mechanicDetails} = this.state;
        let userId = this.props.user.id;
        let res = await pushReq(userId, mechanicDetails.id, mechanicDetails.token);
        this.setState({toggleInfo: false})
    }
    render() {
        const GOOGLE_MAPS_APIKEY = 'AIzaSyCwjyTFzgxg-wUU5rfcny19N9w7EGlq31M';
        return (
            <View style ={{height: height, width: width}}>
                <View style={{width: width, height: height* 0.08, backgroundColor: '#127c7e'}}>
                    <TouchableOpacity style= {Styles.headerSubContent}  onPress={() => this.props.navigation.openDrawer()}>
                        <Image source={require('./../../Images/menu.png')} style={Styles.menuImg}/>
                    </TouchableOpacity>
                </View>
                <View style={this.state.toggleInfo ? {height: height * 0.55, width: width}: {height: height * 0.8, width: width}}>
                {this.state.locSet ?
                <MapView
                    style={styles.map}
                    showUserLocation
                    followUserLocation
                    loadingEnabled
                    region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121}}
                >
                    {this.state.notifOpen ?
                    <MapViewDirections
                        origin={this.state.distOrigin}
                        destination={this.state.distDestination}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    /> :
                        null
                    }
                    {this.state.user.isMechanic ?
                        <MapView.Marker
                            coordinate={marker.coordinates.latitude && this.state.jobNotif.coordinates}
                            title={this.state.jobNotif.name}
                            image={require('./../../Images/userPointer.png')}
                            onPress={()=> this.details(marker)}
                        />
                        :
                        this.state.markers.map(marker => (
                            marker.coordinates ?
                                marker.id == this.state.user.id ?
                                    <MapView.Marker
                                        coordinate={marker.coordinates.latitude && marker.coordinates}
                                        title={marker.name}
                                        description={marker.description}
                                        image={require('./../../Images/userPointer.png')}
                                        onPress={()=> this.details(marker)}
                                    />
                                    :

                                    <MapView.Marker
                                        coordinate={marker.coordinates.latitude && marker.coordinates}
                                        title={marker.name}
                                        description={marker.description}
                                        image={require('./../../Images/mechanicPointer.png')}
                                        onPress={()=> this.details(marker)}
                                    />: null
                        ))
                    }

                </MapView> :
                    <View style={{width: width, height: height, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>}
                </View>

                {this.state.toggleInfo ?
                    <View style={{width: width, height: height * 0.335 ,backgroundColor:'red'}}>
                        <View style={{width:width, height: height* 0.07, backgroundColor:'#7f8082', flexDirection: 'row'}}>
                            <View style={{width: width * 0.7, height: height* 0.07, justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize: 15}}>Reaching destination in 19 minutes!</Text>
                            </View>
                            <View style={{width: width * 0.3, height: height* 0.07, justifyContent: 'center', alignItems:'center'}}>
                                <Text style={{color:'white', fontSize: 17}}>{parseFloat(this.state.distanceTravelled).toFixed(2)} km</Text>
                            </View>
                        </View>

                        <View style={{width: width, height: height* 0.2, backgroundColor:'white', flexDirection: 'row'}}>
                            <View style={{width: width* 0.53, height: height* 0.2, alignItems: 'center'}}>
                                <View style={{width: width*0.17, height: width* 0.17, marginTop: height* 0.01, borderRadius: 100}}>
                                    {this.state.mechanicDetails && this.state.mechanicDetails.image ?
                                        <Image style={{width: width*0.17, height: width* 0.17, borderRadius: 100}} source={{uri: this.state.mechanicDetails.image}}/>
                                        :
                                        <Image style={{width: width*0.17, height: width* 0.17}} source={require('./../../Images/profile.png')}/>
                                    }

                                </View>
                                <View style={{width: width* 0.53, height: height * 0.04, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontWeight: 'bold'}}>{this.state.mechanicDetails && this.state.mechanicDetails.name}</Text>
                                </View>
                                <View style={{width: width* 0.53, height: height * 0.06, flexDirection: 'row', justifyContent:'center', alignItems: 'center'}}>
                                    <Image style={{width: width* 0.08, height: height * 0.05}} source={require('./../../Images/fillStar.png')}/>
                                    <Image style={{width: width* 0.08, height: height * 0.05}} source={require('./../../Images/fillStar.png')}/>
                                    <Image style={{width: width* 0.08, height: height * 0.05}} source={require('./../../Images/fillStar.png')}/>
                                    <Image style={{width: width* 0.08, height: height * 0.05}} source={require('./../../Images/fillStar.png')}/>
                                    <Image style={{width: width* 0.08, height: height * 0.05}} source={require('./../../Images/fillStar.png')}/>
                                </View>
                            </View>
                            <View style={{width: width* 0.005, height: height* 0.17, backgroundColor: '#b7b7b7', marginTop: height* 0.015}}>

                            </View>
                            <View style={{width: width * 0.47, height: height * 0.2, justifyContent:'center', alignItems:'center'}}>
                                <Text style={{fontSize: 17, fontWeight: 'bold'}}>Type</Text>
                                <Text style={{fontSize: 17, fontWeight: 'bold'}}>Motor Bike</Text>
                            </View>
                        </View>
                        <View style={{width: width, height: height * 0.065, backgroundColor:'#10ba81'}}>
                            <TouchableOpacity onPress = {()=> this.pushRequest()}style={{width: width, height: height * 0.065, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 20}}> Request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>:

                    null
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};
export default connect(
    mapStateToProps
)(MapScreen)