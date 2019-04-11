import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, Alert} from 'react-native';
import Styles from './Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'react-native-firebase';
import QRCodeScanner from 'react-native-qrcode-scanner';

const {height, width} = Dimensions.get('window')
const db = firebase.firestore();

class QRScannerScreen extends Component{
    static navigationOptions = {
        header : null
    };

    constructor(props){
        super(props);
        this.state = {
            jobData: {
                jobId: this.props.navigation.getParam('jobId'),
                jobStatusId: this.props.navigation.getParam('jobStatusId') ,
                userId: this.props.user.id
            }
        }
    }

    showToast = (message) =>{
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT
        );
    }

    redirectToMap = () => {
        const redirectMapFunc = this.props.navigation.getParam('redirectMap')
        redirectMapFunc();
        this.props.navigation.navigate("MapScreen", {screen: "MapScreen"})
    }

    jobCompleted = () => {
        Alert.alert('',
            'Your Job is Completed Successfully', 
            [
            {text: 'OK', onPress: () => this.redirectToMap()}]
            );
    }
    
    qrScanner = (data) =>{
        const {jobData} = this.state;
        let qrData = JSON.parse(data.data);
        if(jobData.jobId == qrData.jobId && jobData.jobStatusId == qrData.jobStatusId){
            db.collection('users').doc(qrData.userId).collection('pushReq').doc(qrData.jobId).collection('jobStatus').doc(qrData.jobStatusId).update({
                jobStatus: "Completed"
            }).then((res) => {
                this.jobCompleted()
                console.log(res, 'response')
            }).catch((err) => {
                Alert.alert('','Something goes wrong');
                console.log(err,'errorrrrrrrrrrr')
            })
        }
    }



    render(){
        return(
            <View style = {{backgroundColor: 'grey'}}>
                <View style={Styles.header}>
                    <Text style={Styles.headerText}>QR Scanner</Text>
                </View>
                <View style = {{width : width,
                                height: height * 0.9
                                }}>
                    <View style = {{width: width * 0.8,
                                    height: height * 0.67,
                                    backgroundColor: 'white',
                                    marginLeft: width * 0.1,
                                    marginTop: height * 0.1,
                                    borderRadius: 5}}>
                        <QRCodeScanner
                            cameraStyle = {{
                                        width : width * 0.7,
                                        marginLeft: width * 0.05}}
                            onRead={(data) => this.qrScanner(data)}

                        />
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777',
    },
    textBold: {
        fontWeight: '500',
        color: '#000',
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)',
    },
    buttonTouchable: {
        padding: 16,
    },
});

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
    }, dispatch)
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(QRScannerScreen)