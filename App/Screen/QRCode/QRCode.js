import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, Alert, ToastAndroid } from 'react-native';
import Styles from './Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import QRCode from 'react-native-qrcode';
import firebase from 'react-native-firebase';

const {height, width} = Dimensions.get('window')
const db = firebase.firestore();

class QRCodeScreen extends Component{
    static navigationOptions = {
        header : null
    };

    constructor(props){
        super(props);
        this.state = {
            jobDone: false,
            jobData: {
                jobId: this.props.navigation.getParam('jobId'),
                jobStatusId: this.props.navigation.getParam('jobStatusId') ,
                userId: this.props.user.id
            },
            mechanicDetails: this.props.navigation.getParam('mechanicDetails')
        }

    }

    componentWillMount(){
        this.JobReqResponse();
    }

    JobReqResponse = () => {
        const {jobData,jobId, userId, statusId, mechanicDetails} = this.state;

        db.collection('users').doc(jobData.userId).collection('pushReq').doc(jobData.jobId).collection('jobStatus').doc(jobData.jobStatusId)
            .onSnapshot(async (doc) => {
                if(doc.data().jobStatus == "Completed"){
                    this.setState({jobDone: true});
                    this.showToast('Thank You for using our service please rate our service');
                    setTimeout(() => {
                        this.props.navigation.navigate("RateOrderScreen", {mechanicDetails: mechanicDetails})
                    },1500)
                }
            });
    }

    showToast = (message) =>{
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT
        );
    }


    render(){
        const {jobData, jobDone, mechanicDetails} = this.state;
        return(
            <View>
                <View style={Styles.header}>
                    <Text style={Styles.headerText}>QR Code</Text>
                </View>
                <View style = {{width : width, height: height * 0.9, alignItems: 'center', justifyContent: 'center'}}>
                    <View style = {[jobDone ? {
                                    height: width * 0.8,
                                    width: width * 0.8,
                                    backgroundColor: 'red',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5} :
                                    {
                                    height: width * 0.8,
                                    width: width * 0.8,
                                    backgroundColor: 'green',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 5
                                    }]
                                    }>
                    <QRCode
                        value={JSON.stringify(jobData)}
                        size={250}
                        bgColor='black'
                        fgColor='white'/>

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
)(QRCodeScreen)