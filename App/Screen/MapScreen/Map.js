import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Platform, Dimensions, ActivityIndicator, TouchableOpacity,AsyncStorage,ToastAndroid, BackHandler
} from 'react-native';
import {connect} from "react-redux";
import MapView, { Polyline, Marker, AnimatedRegion } from 'react-native-maps';
import {filterMechanic, setDeviceToken, SetPosition, pushReq, upateMechaincJobs, getMechanicData, acceptJobReq, createJobReq, JobReqRes, CalDistance, updateUserId} from './../../Config/Firebase'
import firebase from 'react-native-firebase';
import Styles from './Styles'
const haversine = require('haversine')
import MapViewDirections from 'react-native-maps-directions';
import { Container, Header, Content, Card, CardItem, Body, Button} from "native-base";
import {BoxShadow} from 'react-native-shadow'
import _ from 'underscore';
import Modal from "react-native-modal";
import StarRating from 'react-native-star-rating';

const db = firebase.firestore();

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
            distDestination: '',
            calDist: 0,
            calDistTime: "00:00:00",
            jobAccepted: false,
            jobId: '',
            jobStatusId: '',
            userId: '',
            isModalVisible: false

        }
        this.getDeviceToken = this.getDeviceToken.bind(this);
        this.getMechanicAndUser = this.getMechanicAndUser.bind(this);
        this.JobReqResponse = this.JobReqResponse.bind(this);
        //this.updateMap = this.updateMap.bind(this);
        this.jobMapView = this.jobMapView.bind(this);
        this.updateMapLocation = this.updateMapLocation.bind(this);
    }

    componentWillMount(){
        this.getDeviceToken();
        this.getMechanicAndUser();
        setInterval(() => {
            this.getMechanicAndUser();
        },100000);
        this.setAsyncData();
        this.backButtonHandler()
    }

    componentDidMount() {
        this.watchPosition();
        this.onNotificationOpen();
        this.foregroundNotificationListner();
    }

    backButtonHandler = () => {
        BackHandler.addEventListener('hardwareBackPress', function () {
            return true
          })
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

        foursquare.venues.getVenues(params)
            .then(function(venues) {
            })
            .catch(function(err){
            });
        let userId = this.props.user.id;
        let res = await SetPosition(userId, latitude, longitude);
        //if(this.state.jobAccepted){
        //    console.log("Acceptedddddddddddddddddddddddddddd")
        //    const  {jobId, jobStatusId, user, userId} = this. state;
        //    if(this.state.user.isMechanic){
        //        let ress = await updateLocation(jobId, jobStatusId, userId, latitude, longitude);
        //    }
        //    else{
        //        let ress = await updateLocation(jobId, jobStatusId, user.id, latitude, longitude);
        //    }
        //}
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
                obj.image = mech.profilePicture;
                obj.jobs = mech.jobs ? mech.jobs : [];
                obj.phoneNo = mech.phoneNo;
                obj.rating = mech.rating;
                obj.avgRating = mech.avgRating
                markers.push(obj);
            }
        });

        markers.push(userObj);
        this.setState({onlineMecahics: onlineMechanic, allMechanics: mechanic, markers: markers})
    }

    foregroundNotificationListner(){
        this.notificationListener = firebase.notifications().onNotification(async (notification: Notification) => {
            const jobData = notification._data;
            const user = this.props.user;
            const userLat = user.latitude ;
            const userLang = user.longitude ;
            const destinationLogitude = parseFloat(jobData.longitude);
            const destinationLatitude = parseFloat(jobData.latitude);
            console.log(jobData.longitude,'/////////////////')
            console.log(user.latitude,'userrrrrrrrrrrrrrrrrrrrraaaaaaaaaaaa')
            const origin = {latitude: userLat, longitude: userLang};
            const destination = {latitude: destinationLatitude, longitude: destinationLogitude};
            const obj = {
                coordinates: {latitude: destinationLatitude , longitude: destinationLogitude},
                name: jobData.name,
                id: jobData.id,
                phoneNo: jobData.phoneNo,
                profilePicture: jobData.profilePicture
            }
            let res = await CalDistance(userLang, userLat, destinationLogitude, destinationLatitude);
            let calDist = res.route.distance;
            let calDistTime = res.route.formattedTime;  

            notification._data && this.setState({
                                        jobNotif: obj, 
                                        notifOpen: true, 
                                        distOrigin: origin, 
                                        distDestination: destination,
                                        calDist, 
                                        calDistTime,},()=>{
                this.setUserView()
            })
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
            const userLat = user.latitude ;
            const userLang = user.longitude ;
            const destinationLogitude = parseFloat(jobData.longitude);
            const destinationLatitude = parseFloat(jobData.latitude);

            const origin = {latitude: userLat, longitude: userLang};
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
    };

    async details(marker){
        let user = this.props.user;
        let userLang = user.longitude;
        let userLat = user.latitude;
        let mecLang = marker.coordinates.longitude;
        let machLat = marker.coordinates.latitude;
        let res = await CalDistance(mecLang, machLat, userLang, userLat);
        let calDist = res.route.distance;
        let calDistTime = res.route.formattedTime;
        
        this.setState({toggleInfo: true});
        this.setState({mechanicDetails: marker, calDist, calDistTime, isModalVisible: true})
    }

    async pushRequest(){
        const  {mechanicDetails, user} = this.state;
        let res = await pushReq(user, mechanicDetails.id, mechanicDetails.token);
        if(res.id){
            this.showToast('Your job send successfully');
            let jobs = [];
            let obj = {};
            let updateStatusRes = await createJobReq(res.id, user.id);
            jobs = mechanicDetails.jobs;
            obj.jobId = res.id;
            obj.jobStatusId = updateStatusRes.id;
            jobs.push(obj);
            let ress = await upateMechaincJobs(jobs, mechanicDetails.id, updateStatusRes.id);
            this.JobReqResponse(res.id, user.id, updateStatusRes.id);

            this.setState({toggleInfo: false, jobId: res.id, jobStatusId: updateStatusRes.id, isModalVisible: false});
        }
    }

     JobReqResponse(jobId, userId, statusId){
        let data = {}
        db.collection('users').doc(userId).collection('pushReq').doc(jobId).collection('jobStatus').doc(statusId)
            .onSnapshot(async (doc) => {
                if(doc.data().jobStatus == "Accept"){
                    Alert.alert('','Your job accepted')
                    let updateuserId = await updateUserId(userId, this.state.mechanicDetails.id);
                    //this.updateMap(doc.data());
                    this.updateMapLocation();
                }
            });
    }

    updateMapLocation(){
        const {user} = this.state;
        let markers = [];
        db.collection('users').doc(user.id)
        .onSnapshot((doc) => {
            const originLogitude = parseFloat(doc.data().longitude);
            const originLatitude = parseFloat(doc.data().latitude);
            const origin = {latitude: originLatitude, longitude: originLogitude};
            let obj = {};
            obj.coordinates = {latitude: doc.data().latitude , longitude: doc.data().longitude};
            obj.name = doc.data().firstName + " " + doc.data().lastName;
            obj.description = doc.data().description;
            obj.id = doc.data().id;
            obj.token = doc.data().deviceToken;
            obj.image = doc.data().profilePicture;
            obj.jobs = doc.data().jobs ? doc.data().jobs : [];
            obj.phoneNo = doc.data().phoneNo;
            obj.isMechanic = doc.data().isMechanic;
            markers = [];
            markers.push(obj);
            db.collection('users').doc(doc.data().jobReqId)
            .onSnapshot((doc) => {
                const destinationLogitude = parseFloat(doc.data().longitude);
                const destinationLatitude = parseFloat(doc.data().latitude);
                const destination = {latitude: destinationLatitude, longitude: destinationLogitude};
                let obj1 = {};
                obj1.coordinates = {latitude: doc.data().latitude , longitude: doc.data().longitude};
                obj1.name = doc.data().firstName + " " + doc.data().lastName;
                obj1.description = doc.data().description;
                obj1.id = doc.data().id;
                obj1.image = doc.data().profilePicture;
                obj1.jobs = doc.data().jobs ? doc.data().jobs : [];
                obj1.phoneNo = doc.data().phoneNo;
                obj1.isMechanic = doc.data().isMechanic;
                markers.push(obj1);
                this.setState({distOrigin: origin, distDestination: destination, jobAccepted: true, markers: markers})
            })
        })
    }

    //updateMap(data){
    //    const destinationLogitude = parseFloat(data.mechanicLoc.longitude);
    //    const destinationLatitude = parseFloat(data.mechanicLoc.latitude);
    //    const origin = {latitude: 24.87217, longitude: 67.3529129};
    //    const destination = {latitude: destinationLatitude, longitude: destinationLogitude};
    //    this.setState({distOrigin: origin, distDestination: destination, jobAccepted: true})
    //}

    async acceptJob(){
        const {user, jobNotif} = this.state;
        const res = await getMechanicData(user.id);
        const jobs = res.jobs;
        const currentJob = _.last(jobs);
        let updateuserId = await updateUserId(user.id, jobNotif.id);
        let updateStatusRes = await acceptJobReq(currentJob, jobNotif, user);
        if(updateStatusRes == 'Job Accepted Successfully'){
            this.updateMapLocation();
            this.setState({jobAccepted: true, jobId: currentJob.jobId, jobStatusId: currentJob.jobStatusId, userId: jobNotif.id, notifOpen: false})
            this.showToast(updateStatusRes)
        }
        else{
            Alert.alert("Something went wrong")
        }
        this.setState({notifOpen: false})
    }

    showToast = (message) =>{
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT
        );
    }

    redirectMap = () => {
        this.setState({jobAccepted: false})
    }
    setUserView(){
        const {jobNotif, notifOpen} = this.state;
        return(
            <View style = {{flex: 1}}>
                <Modal
                    isVisible={notifOpen}
                >


                    <View style={{ width: width * 0.9,
                     height: height * 0.4,
                     backgroundColor: 'white',
                     marginLeft: width * 0,

                     overflow: 'hidden',
                     marginTop: height * 0.2,
                     alignItems: 'center'
                     }}>
                        <View style = {{
                                        width: width *0.8 ,
                                        height: height * 0.05,
                                        marginTop: height * 0.03,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        flexDirection: 'row'}}
                        >
                            <Text numberOfLines = {1}
                                style = {{color: '#ff8c00', fontSize: 16, paddingLeft: width * 0.02 }}>Destination distance time:</Text>
                            <Text style = {{color: '#ff8c00', fontSize: 16, }}>{this.state.calDistTime} Min</Text>
                        </View>

                        <View style = {{
                                        width: width *0.8 ,
                                        height: height * 0.05,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row'}}
                        >
                            <Text style = {{color: '#ff8c00', fontSize: 16, width: width * 0.6}}>Destination distance:</Text>
                            <Text style = {{color: '#ff8c00', fontSize: 16}}>{parseFloat(this.state.calDist).toFixed(2)} km</Text>
                        </View>

                        <View style = {{
                                        width: width *0.8 ,
                                        height: height * 0.05,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row'}}
                        >
                            <Text style = {{width: width * 0.27, color: '#ff8c00', fontSize: 16}}>Phone No:</Text>
                            <Text style = {{width: width * 0.5, textAlign: 'right', color: '#ff8c00', fontSize: 16}}>{jobNotif.phoneNo}</Text>
                        </View>

                        <View style = {{
                                        width: width *0.8 ,
                                        height: height * 0.05,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'row'}}
                        >
                            <Text style = {{color: '#ff8c00', fontSize: 16, width: width * 0.52}}>Vehicle Type:</Text>
                            <Text style = {{color: '#ff8c00', fontSize: 16, width: width * 0.25, textAlign: 'right'}}>Car</Text>
                        </View>

                        <View style = {{width: width,
                                        height: height * 0.18,
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                        }}>
                            <TouchableOpacity
                                onPress = {() => {this.acceptJob()}}
                                style = {{
                                        height: height * 0.07,
                                        width: width * 0.35,
                                        borderWidth: 2,
                                        borderColor: '#ff8c00',
                                        borderRadius: 5,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                        }}>
                                <Text style = {{fontSize: 17, fontWeight: 'bold', color: '#ff8c00'}}>Accept</Text>

                            </TouchableOpacity>
                            <TouchableOpacity style = {{
                                                        height: height * 0.07,
                                                        width: width * 0.35,
                                                        borderWidth: 2,
                                                        borderColor: '#ff8c00',
                                                        borderRadius: 5,
                                                        marginLeft: width * 0.06,
                                                        justifyContent: 'center',
                                                        alignItems: 'center'}}>
                                <Text style = {{fontSize: 17, fontWeight: 'bold', color: '#ff8c00'}}>Reject</Text>

                            </TouchableOpacity>
                        </View>

                        {/*<View style = {{width: width * 0.15, height: width * 0.15, borderRadius: 100}}>
                            {jobNotif.profilePicture ?
                                <Image source = {{uri: jobNotif.profilePicture}} style = {{ borderRadius: 100, width: width * 0.12, height: width * 0.12}}/>:
                                <Image source = {require('./../../Images/profile.png')} style = {{width: width * 0.12, height: width * 0.12}}/>

                            }
                        </View>*/}

                        {/*<View style = {{width: width * 0.21,
                                        height: width * 0.21,
                                        borderRadius: 100,
                                        marginTop: height * 0.1,
                                        marginRight: width * 0.4,
                                        borderWidth: 5,
                                        borderColor: '#ff8c00',
                                        justifyContent: 'center',
                                        alignItems: 'center'}}>
                            <Image resizeMode = "contain"
                                   resizeMethod = "auto"
                                   source = {require('./../../Images/profile_placeholder.png')}
                                   style = {{width: width * 0.2, height: width * 0.2}}/>
                        </View>*/}
                    </View>


                </Modal>
            </View>

        )
    }

    mechanicDetailsView(){
        const {mechanicDetails} = this.state;
        return(
            <View style = {{flex: 1}}>
                <Modal
                    onBackdropPress = {() => this.setState({isModalVisible: false})}
                    onBackButtonPress = {() => this.setState({isModalVisible: false})}
                    isVisible={this.state.isModalVisible}
                >

                    <View style={{ width: width * 0.8,
                     height: height * 0.7,
                     backgroundColor: 'white',
                     marginLeft: width * 0.05,
                     borderRadius: 5,
                     overflow: 'hidden',
                     marginTop: height * 0.1
                     }}>
                        <View style = {{width: width * 0.25,
                                        height: width * 0.25,
                                        marginLeft: width * 0.3,
                                        borderRadius: 100,
                                        marginTop: height * 0.0375,
                                        borderColor: 'orange',
                                        backgroundColor: 'orange',
                                        borderWidth: 1,
                                        overflow: 'hidden'}}>
                            {this.state.mechanicDetails && this.state.mechanicDetails.image ?
                                <Image resizeMode = 'cover'
                                       style = {{
                                                 width: width * 0.25,
                                                 height: width * 0.25
                                                 }}
                                       source={{uri: this.state.mechanicDetails.image}}/>
                                :
                                <Image resizeMode = 'cover'
                                       style = {{
                                                 width: width * 0.25,
                                                 height: width * 0.25
                                                 }}
                                       source={require('./../../Images/profile_placeholder.png')}/>
                            }
                        </View>

                        <View style = {{width: width * 0.8, height: height * 0.05, alignItems: 'center'}}>
                            <Text numberOfLines = {1} style={{fontSize: 15, color: 'orange', fontWeight: 'bold'}}>{this.state.mechanicDetails && this.state.mechanicDetails.name}</Text>
                        </View>
                        <View style = {{
                                        borderBottomColor: 'grey',
                                        borderBottomWidth: StyleSheet.hairlineWidth}}>

                        </View>
                        <View style = {{width: width * 0.8, height: height * 0.06, marginTop: height * 0.04, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{color: '#11397a',  marginLeft: width * 0.07}}>Phone no:</Text>
                                <Text style={{color: '#11397a',  marginRight: width * 0.07}}>{this.state.mechanicDetails && this.state.mechanicDetails.phoneNo}</Text>
                        </View>
                        <View style = {{width: width * 0.8, height: height * 0.06, flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={{color: '#11397a',  marginLeft: width * 0.07}}>Distane:</Text>
                                <Text style={{color: '#11397a', marginRight: width * 0.07}}>{this.state.calDist} Km</Text>
                        </View>

                        <View style = {{width: width * 0.8, height: height * 0.06, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{color: '#11397a', marginLeft: width * 0.07}}>Reaching Time:</Text>
                            <Text style={{color: '#11397a', marginRight: width * 0.07}}>{this.state.calDistTime}</Text>
                        </View>

                        <View style = {{width: width * 0.8, height: height * 0.06, flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{color: '#11397a', marginLeft: width * 0.07}}>Rating:</Text>
                            <StarRating
                                disabled={true}
                                maxStars={5}
                                emptyStar={require('./../../Images/star.png')}
                                fullStar={require('./../../Images/fillStar.png')}
                                halfStar={require('./../../Images/fillStar.png')}
                                rating={mechanicDetails.avgRating ? mechanicDetails.avgRating : 0 }
                                containerStyle = {{marginRight: width * 0.07}}
                                starStyle = {{width: width* 0.07, height: width* 0.07}}
                            />
                        </View>

                        <TouchableOpacity
                            onPress = {()=> this.pushRequest()}
                            style = {{
                              width: width * 0.6,
                              height: height * 0.08,
                              backgroundColor: 'orange',
                              borderRadius: 5,
                              marginLeft: width * 0.1,
                              elevation: 4,
                              marginTop: height * 0.06,
                              justifyContent: 'center',
                              alignItems: 'center'
                              }}>
                                <Text style = {{fontSize: 20, color: 'white', fontWeight: 'bold'}}>Request</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        )
    }

    mapView(){
        const GOOGLE_MAPS_APIKEY = 'AIzaSyCwjyTFzgxg-wUU5rfcny19N9w7EGlq31M';
        var coordinates = {latitude: this.state.latitude, longitude: this.state.longitude};
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

                        {this.state.user.isMechanic ?
                            this.state.markers.map(marker => {

                                if(this.state.user.id == marker.id){
                                    return(
                                        <MapView.Marker
                                            coordinate={coordinates}
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
                                            coordinate={coordinates}
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

    jobMapView(){
        const {jobId, jobStatusId, mechanicDetails} = this.state;
        const {user} = this.props;
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

                        <MapViewDirections
                            origin={this.state.distOrigin}
                            destination={this.state.distDestination}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={4}
                            strokeColor="#0059b3"
                        />
                    {
                        this.state.markers.map((marker) => {

                            if(marker.isMechanic){
                                return(
                                    <MapView.Marker
                                        coordinate={marker.coordinates.latitude && marker.coordinates}
                                        title={marker.name}
                                        description={marker.description}
                                        image={require('./../../Images/mechanicPointer.png')}
                                    />
                                )
                            }
                            else{
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
                    }
                </MapView>
                { user.isMechanic ?
                    <TouchableOpacity onPress = {() => {this.props.navigation.navigate("QRScannerScreen", {redirectMap: this.redirectMap ,userId: this.state.userId, jobStatusId: this.state.jobStatusId, jobId: this.state.jobId, screen: "QRScannerScreen"})}} style = {{width: width * 0.7, height: height * 0.08, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'orange', top: height * 0.78, left: width * 0.15}}>
                        <Text style = {{fontSize: 17, color: 'white'}}>Complete Job</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress = {() => {this.props.navigation.navigate("QRCodeScreen", {redirectMap: this.redirectMap, jobStatusId: jobStatusId, jobId: jobId, screen: "QRCodeScreen", mechanicDetails: mechanicDetails})}} style = {{width: width * 0.7, height: height * 0.08, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'orange', top: height * 0.78, left: width * 0.15}}>
                        <Text style = {{fontSize: 17, color: 'white'}}>Job Done</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }

    render() {
        return (
            <View style ={{height: height, width: width}}>
                <View style={{width: width, height: height* 0.08, backgroundColor: '#ff8c00', elevation: 2}}>
                    <TouchableOpacity style= {Styles.headerSubContent}  onPress={() => this.props.navigation.openDrawer()}>
                        <Image source={require('./../../Images/menu.png')} style={Styles.menuImg}/>
                    </TouchableOpacity>
                </View>
                <View style={this.state.toggleInfo || this.state.notifOpen ? {height: height * 0.89, width: width, backgroundColor:'red'}: {height: height * 0.89, width: width}}>
                {this.state.locSet ? this.state.jobAccepted ? this.jobMapView() : this.mapView() :

                    <View style={{width: width, height: height, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                }
                {/*this.state.jobAccepted ? this.jobMapView() : this.mapView()*/}
                </View>
                {/*true ? this.setUserView() : this.state.toggleInfo ? this.mechanicDetailsView() : null*/}
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