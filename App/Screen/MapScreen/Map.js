import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
import MapView from 'react-native-maps';

const markerImage = require('./../../Images/pin.png')

export default class MapScreen extends Component{

    constructor(props){
        super(props);
        this.state = {
            longitude: '',
            latitude: '',
            getPosition: false
        }
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    getPosition: true
                });
            },
            (error) => this.setState({ error: error.message }),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000, distanceFilter: 10 },
        );
    }


    render() {
        return (
            <View style ={styles.container}>
                {this.state.getPosition ?
                    <MapView
                        style={styles.map}
                        region={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.0121,
                        }}
                        onRegionChange={(loc)=> console.log(loc,'ssssssssssssss')}
                    >
                            <MapView.Marker
                            coordinate={{latitude: this.state.latitude,
                                longitude: this.state.longitude}}
                            title={"Home"}
                            description={"Current Location"}
                            >
                            </MapView.Marker>
                    </MapView>
                    : null
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});
