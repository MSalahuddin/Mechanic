import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Platform, Dimensions, ActivityIndicator, TouchableOpacity
} from 'react-native';
import {connect} from "react-redux";
import MapView, { Polyline, Marker, AnimatedRegion } from 'react-native-maps';

const haversine = require('haversine')
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
            toggleInfo: false
        }
    }

    componentDidMount() {
        this.watchID = navigator.geolocation.watchPosition(
            position => {
                const {routeCoordinates, distanceTravelled } =   this.state;
                const { latitude, longitude } = position.coords;

                const newCoordinate = {
                    latitude,
                    longitude
                };

                this.setState({
                    latitude,
                    longitude,
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled:
                    distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate,
                    locSet: true
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

    render() {
        return (
            <View style ={{height: height, width: width}}>
                <Image style={{position: 'absolute', width: 20, height: 20}} source={require('./../../Images/profile.png')}/>
                <View style={this.state.toggleInfo ? {height: height * 0.6, width: width}: {height: height, width: width}}>
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
                    <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} />
                   <Marker
                       coordinate={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude}}
                       title={"Home"}
                       description={"Current Location"}
                       image={require('./../../Images/pin.png')}
                       onPress={()=> this.setState({toggleInfo: true})}
                   />
                </MapView> :
                    <View style={{width: width, height: height, alignItems: 'center', justifyContent: 'center'}}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>}
                </View>

                {this.state.toggleInfo ?
                    <View style={{width: width, height: height * 0.37 ,backgroundColor:'red'}}>
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
                                    <Image style={{width: width*0.17, height: width* 0.17}} source={require('./../../Images/profile.png')}/>
                                </View>
                                <View style={{width: width* 0.53, height: height * 0.04, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontWeight: 'bold'}}>Muhammad Salahuddin</Text>
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
                        <View style={{width: width, height: height * 0.1, backgroundColor:'#10ba81'}}>
                            <TouchableOpacity style={{width: width, height: height * 0.1, alignItems: 'center', justifyContent: 'center'}}>
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