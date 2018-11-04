import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Platform, Dimensions, ActivityIndicator, TouchableOpacity,AsyncStorage
} from 'react-native';
import {connect} from "react-redux";
import MapView, { Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import {filterMechanic, setDeviceToken, SetPosition, pushReq, upateMechaincJobs, getMechanicData, acceptJobReq, createJobReq} from './../../Config/Firebase'
import firebase from 'react-native-firebase';
import Styles from './Styles'
const haversine = require('haversine')
import MapViewDirections from 'react-native-maps-directions';
import { Container, Header, Content, Card, CardItem, Body, Button} from "native-base";
import {BoxShadow} from 'react-native-shadow'
import _ from 'underscore';
var foursquare = require('react-native-foursquare-api')({
    clientID: '224RPKIX35NN0ZUBWZDK5RAUOTPCVGQBQBEVN5WYMRP5RCGQ',
    clientSecret: '55YHEWUZLM2LGM44QVL3IHUAENYVD4QMVGC2ZFMEIARZAZUX',
    style: 'foursquare', // default: 'foursquare'
    version: '20140806' //  default: '20140806'
});

const {height, width} = Dimensions.get('window');

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

    componentDidMount() {
        this.watchPosition();
        this.onNotificationOpen();
        this.foregroundNotificationListner();
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
        var params = {
            "ll": `${latitude},${longitude}`,
            "query": 'urdu'
        };
        console.log(params,'kkkkkkkkkkkkkkkkkkkkkkk')
        console.log(longitude,'..........////////////bbbbbbbbbbbbbb')
        console.log(latitude,'..........////////////bbbbbbbbbbbbbb')
        foursquare.venues.getVenues(params)
            .then(function(venues) {
                console.log(venues,'vvvvvvvvvvvvvvvvvvvvvvvvv');
            })
            .catch(function(err){
                console.log(err,'eeeeeeeeeeeeeeee');
            });
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
            console.log(mech,'////////////////////////////................')
            if(mech.deviceToken){
                onlineMechanic.push(mech);
                let obj = {};
                obj.coordinates = {latitude: mech.latitude , longitude: mech.longitude};
                obj.name = mech.firstName + " " + mech.lastName;
                obj.description = mech.description;
                obj.id = mech.id;
                obj.token = mech.deviceToken;
                obj.image = mech.profilePicture;
                obj.jobs = mech.jobs ? mech.jobs : [];
                obj.phoneNo = mech.phoneNo;
                markers.push(obj);
            }
        });
        console.log(markers,'sssssssssssssmmmmmmmmmmmmm')
        markers.push(userObj);
        this.setState({onlineMecahics: onlineMechanic, allMechanics: mechanic, markers: markers})
    }

    foregroundNotificationListner(){
        this.notificationListener = firebase.notifications().onNotification((notification: Notification) => {
            console.log(notification,'nnnnnnnnnnnnnnnnnnnnnnn')
            const jobData = notification._data;
            const user = this.props.user;
            const destinationLogitude = parseFloat(jobData.longitude);
            const destinationLatitude = parseFloat(jobData.latitude);
            const origin = {latitude: 24.87217, longitude: 67.3529129};
            const destination = {latitude: destinationLatitude, longitude: destinationLogitude};
            const obj = {
                coordinates: {latitude: destinationLatitude , longitude: destinationLogitude},
                name: jobData.name,
                id: jobData.id,
                phoneNo: jobData.phoneNo,
                profilePicture: jobData.profilePicture
            }

            notification._data && this.setState({jobNotif: obj, notifOpen: true, distOrigin: origin, distDestination: destination},()=>{
                this.setUserView()
            })
            console.log(jobData,'dsdddddddddddddddddddddddddddddddd')
        });
    }
    onNotificationOpen(){
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
                phoneNo: jobData.phoneNo,
                profilePicture: jobData.profilePicture
            }

            notification._data && this.setState({jobNotif: obj, notifOpen: true, distOrigin: origin, distDestination: destination},()=>{
                this.setUserView()
            })
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
        console.log(marker,'sssssssssssssssppppppppppppppppppppppppp')
        this.setState({toggleInfo: true});
        this.setState({mechanicDetails: marker})
    }

    async pushRequest(){
        console.log('oooooooooooooooooooooo')
        const  {mechanicDetails, user} = this.state;
        let res = await pushReq(user, mechanicDetails.id, mechanicDetails.token);
        if(res.id){
            Alert.alert('','Your job send successfully');

            let jobs = [];
            let obj = {};
            let updateStatusRes = await createJobReq(res.id, user.id);
            console.log(updateStatusRes.id,'///////////////')
            jobs = mechanicDetails.jobs;
            obj.jobId = res.id;
            obj.jobStatusId = updateStatusRes.id;
            jobs.push(obj);
            let ress = await upateMechaincJobs(jobs, mechanicDetails.id, updateStatusRes.id);
            console.log(ress,'bbbbbbbbbbbbbbbbbbbbbbbbbbbb')


        }
        this.setState({toggleInfo: false})
    }

    async acceptJob(){
        const {user, jobNotif} = this.state;
        const res = await getMechanicData(user.id);
        const jobs = res.jobs;
        const currentJob = _.last(jobs);
        console.log(jobNotif,'skkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
        console.log(currentJob,'/////////////////////////')
        console.log(jobs,'sssssssssssssssssssssssss')
        console.log(res,';;;;;;;;;;;;;;;;')
        let updateStatusRes = await acceptJobReq(currentJob, jobNotif, user);

        if(updateStatusRes == 'Job Accepted Successfully'){
            Alert.alert(updateStatusRes)
        }
        else{
            Alert.alert("Something went wrong")
        }
        this.setState({notifOpen: false})
        console.log(updateStatusRes,'llllllllllllllllllllllllllllllllll')
    }

    setUserView(){
        const {jobNotif} = this.state;
        return(
            <View style = {{width: width, height: height * 0.4, position: 'absolute', marginTop: height * 0.5}}>
                <Content padder>
                    <Card>
                        <CardItem header bordered style = {{height: height * 0.07}}>
                            <View style={{width:width, flexDirection: 'row'}}>
                                <View style={{width: width * 0.65, height: height* 0.07, justifyContent: 'center', alignItems:'center'}}>
                                    <Text style={{color:'#80aaff', fontSize: 15, fontWeight: 'bold'}}>Reaching destination in 19 minutes!</Text>
                                </View>
                                <View style={{width: width * 0.25, height: height* 0.07, justifyContent: 'center', alignItems:'center'}}>
                                    <Text style={{color:'#80aaff', fontSize: 17, fontWeight: 'bold'}}>{parseFloat(this.state.distanceTravelled).toFixed(2)} km</Text>
                                </View>
                            </View>
                        </CardItem>
                        <CardItem bordered>
                            <Body>
                                <View style = {{width: width, height: height * 0.13, flexDirection: 'row'}}>
                                    <View style = {{width: width * 0.4, justifyContent: 'center', alignItems: 'center'}}>
                                        <View style = {{width: width * 0.15, height: width * 0.15, borderRadius: 100}}>
                                            {jobNotif.profilePicture ?
                                                <Image source = {{uri: jobNotif.profilePicture}} style = {{ borderRadius: 100, width: width * 0.12, height: width * 0.12}}/>:
                                                <Image source = {require('./../../Images/profile.png')} style = {{width: width * 0.12, height: width * 0.12}}/>

                                            }
                                        </View>
                                        <View style = {{width: width * 0.4}}>
                                            <Text style = {{fontSize: 14, fontWeight: 'bold', marginLeft: width * 0.06}}>{jobNotif.name}</Text>
                                        </View>
                                    </View>
                                    <View style={{width: width* 0.003, height: height* 0.11, backgroundColor: '#b7b7b7', marginTop: height* 0.012}}>

                                    </View>
                                    <View style = {{width: width * 0.4, justifyContent: 'center', alignItems: 'center', marginLeft: width * 0.04}}>
                                        <View style = {{width: width * 0.4, height: height * 0.06}}>
                                            <Text style = {{fontSize: 15, fontWeight: 'bold'}}>{jobNotif.phoneNo}</Text>
                                        </View>
                                        <View style = {{width: width * 0.4, height: height * 0.08}}>
                                            <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Vehicle Type:</Text>
                                            <Text style = {{fontSize: 15, fontWeight: 'bold'}}>Bike</Text>
                                        </View>

                                    </View>
                                </View>
                            </Body>
                        </CardItem>
                        <CardItem footer bordered>
                            <View style = {{width: width, height: height * 0.08, flexDirection: 'row'}}>
                                <TouchableOpacity onPress = {() => {this.acceptJob()}} style = {{width: width * 0.4, height: height * 0.07, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#4d79ff'}}>
                                    <Text>Accept Job</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style = {{width: width * 0.4, height: height * 0.07, marginLeft: width * 0.04, justifyContent: 'center', alignItems: 'center', borderRadius: 20, backgroundColor: '#ff3333'}}>
                                    <Text>Reject Job</Text>
                                </TouchableOpacity>

                            </View>
                        </CardItem>
                    </Card>
                </Content>
            </View>

        )
    }

    mechanicDetailsView(){
        return(
            <View style = {{marginTop: height * 0.2, width: width, height: height* 0.7, position: 'absolute'}}>
                <Content padder>
                    <Card>
                <View style = {{width: width * 0.9, height: height * 0.25, flexDirection: 'row'}}>
                    <View style = {{width: width * 0.5, height: height * 0.25, marginLeft: width * 0.25}}>
                        <View style = {{width: width * 0.2, height: width * 0.2, marginLeft: width * 0.12, borderRadius: 100, marginTop: height * 0.0375 }}>
                            {this.state.mechanicDetails && this.state.mechanicDetails.image ?
                                <Image style={{width: width * 0.2, height: width * 0.2, borderRadius: 100}} source={{uri: this.state.mechanicDetails.image}}/>
                                :
                                <Image style={{width: width * 0.17, height: width * 0.17}} source={require('./../../Images/profile.png')}/>
                            }
                        </View>
                        <View style = {{width: width * 0.5, height: height * 0.1, marginTop: height * 0.02, alignItems: 'center'}}>
                            <Text style={{fontSize: 20, color: '#11397a'}}>{this.state.mechanicDetails && this.state.mechanicDetails.name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress = {() => this.setState({toggleInfo: false})} style = {{width: width * 0.15, height: height * 0.2}}>
                        <Image source = {require('./../../Images/delete.png')} style = {{marginTop: height * 0.035, marginLeft: width * 0.05, width: width * 0.05, height: width * 0.05}}/>
                    </TouchableOpacity>
                </View>
                <View style = {{width : width * 0.9, height: height * 0.22}}>
                    <View style = {{width: width * 0.9, height: height * 0.05, flexDirection: 'row'}}>
                        <View style = {{width: width * 0.35, height: height * 0.05}}>
                            <Text style={{color: '#11397a', marginLeft: width * 0.07}}>Phone no:</Text>
                        </View>
                        <View style = {{width: width * 0.37, height: height * 0.05, marginLeft: width * 0.18}}>
                            <Text style={{color: '#11397a'}}>{this.state.mechanicDetails && this.state.mechanicDetails.phoneNo}</Text>
                        </View>
                    </View>
                    <View style = {{width: width * 0.9, height: height * 0.05, flexDirection: 'row'}}>
                        <View style = {{width: width * 0.35, height: height * 0.05}}>
                            <Text style={{color: '#11397a', marginLeft: width * 0.07}}>Phone no:</Text>
                        </View>
                        <View style = {{width: width * 0.37, height: height * 0.05, marginLeft: width * 0.18}}>
                            <Text style={{color: '#11397a'}}>+923062691335</Text>
                        </View>
                    </View>
                    <View style = {{width: width * 0.9, height: height * 0.05, flexDirection: 'row'}}>
                        <View style = {{width: width * 0.35, height: height * 0.05}}>
                            <Text style={{color: '#11397a', marginLeft: width * 0.07}}>Phone no:</Text>
                        </View>
                        <View style = {{width: width * 0.37, height: height * 0.05, marginLeft: width * 0.18}}>
                            <Text style={{color: '#11397a'}}>+923062691335</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress = {()=> this.pushRequest()} style = {{width: width * 0.9, height: height * 0.15, alignItems: 'center'}}>
                    <Image source = {require('./../../Images/check.png')} style = {{width: width * 0.1, height: width * 0.1}}/>
                    <Text style = {{fontSize: 25, color: '#04931e'}}>Request</Text>
                </TouchableOpacity>
                    </Card>
                </Content>
            </View>

        )
    }

    mapView(){
        const GOOGLE_MAPS_APIKEY = 'AIzaSyCwjyTFzgxg-wUU5rfcny19N9w7EGlq31M';
        return(
            <View style = {{flex: 1}}>
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
                            strokeWidth={4}
                            strokeColor="#0059b3"
                        /> :
                        null
                    }
                    {this.state.user.isMechanic ?
                        this.state.markers.map(marker => {

                            if(this.state.user.id == marker.id){
                                return(
                                    <MapView.Marker
                                        coordinate={marker.coordinates.latitude && marker.coordinates}
                                        title={marker.name}
                                        description={marker.description}
                                        image={require('./../../Images/userPointer.png')}
                                    />
                                )
                            }
                        })
                        :
                        this.state.markers.map(marker => (
                            marker.coordinates ?
                                marker.id == this.state.user.id ?
                                    <MapView.Marker
                                        coordinate={marker.coordinates.latitude && marker.coordinates}
                                        title={marker.name}
                                        description={marker.description}
                                        image={require('./../../Images/userPointer.png')}
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

                </MapView>
            </View>
        )
    }

    render() {

        return (
            <View style ={{height: height, width: width}}>
                <View style={{width: width, height: height* 0.08, backgroundColor: '#127c7e'}}>
                    <TouchableOpacity style= {Styles.headerSubContent}  onPress={() => this.props.navigation.openDrawer()}>
                        <Image source={require('./../../Images/menu.png')} style={Styles.menuImg}/>
                    </TouchableOpacity>
                </View>
                <View style={this.state.toggleInfo || this.state.notifOpen ? {height: height * 0.89, width: width, backgroundColor:'red'}: {height: height * 0.89, width: width}}>
                {this.state.locSet ? this.mapView() :

                    <View style={{width: width, height: height, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                }
                </View>

                {this.state.notifOpen ? this.setUserView() : this.state.toggleInfo ? this.mechanicDetailsView() : null}

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