import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, Alert} from 'react-native';
import Styles from './Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import QRCode from 'react-native-qrcode';
import firebase from 'react-native-firebase';

import Modal from "react-native-modal";
import StarRating from 'react-native-star-rating';

const {height, width} = Dimensions.get('window')
const db = firebase.firestore();

class QRCodeScreen extends Component{
    static navigationOptions = {
        header : null
    };

    constructor(props){
        super(props);
        this.state = {
            //jobDone: false,
            //jobData: {
            //    jobId: this.props.navigation.getParam('jobId'),
            //    jobStatusId: this.props.navigation.getParam('jobStatusId') ,
            //    userId: this.props.user.id
            //},
            isModalVisible: false,
            starCount: 3.5
        }

    }

    componentWillMount(){
        //this.JobReqResponse();
    }

    JobReqResponse = () => {
        const {jobData,jobId, userId, statusId} = this.state;
        db.collection('users').doc(jobData.userId).collection('pushReq').doc(jobData.jobId).collection('jobStatus').doc(jobData.jobStatusId)
            .onSnapshot(async (doc) => {
                if(doc.data().jobStatus == "Completed"){
                    this.setState({jobDone: true})
                    Alert.alert('','Thank You for using our service please rate our service ')
                }
            });
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }


    render(){
        //const {jobData, jobDone} = this.state;
        return(
            <View>
                <View style={Styles.header}>
                    <Text style={Styles.headerText}>QR Code</Text>
                </View>
                <View style = {{width : width, height: height * 0.9, alignItems: 'center', justifyContent: 'center'}}>
                    {/* <View style = {[jobDone ? {
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
                    {<QRCode
                        value={JSON.stringify(jobData)}
                        size={200}
                        bgColor='black'
                        fgColor='white'/>}

                    </View>*/}
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={this._toggleModal}>
                            <Text>Show Modal</Text>
                        </TouchableOpacity>
                        <Modal
                            onBackdropPress = {() => this.setState({isModalVisible: false})}
                            onBackButtonPress = {() => this.setState({isModalVisible: false})}
                            isVisible={this.state.isModalVisible}
                        >
                            <View style={{ width: width * 0.8,
                                           height: height * 0.6,
                                           backgroundColor: 'white',
                                           marginLeft: width * 0.05,
                                           borderRadius: 5,
                                           overflow: 'hidden'
                                           }}>
                                <View style = {{width: width,
                                                height: height * 0.1,
                                                borderBottomColor: '#bbb',
                                                borderBottomWidth: StyleSheet.hairlineWidth,
                                                justifyContent: 'center',
                                                }}>
                                    <Text style = {{color: 'black', fontSize: 20, fontWeight: 'bold', marginLeft: width * 0.2}}>
                                        Rate Our Service
                                    </Text>
                                </View>

                                <StarRating
                                    disabled={false}
                                    maxStars={5}
                                    emptyStar={require('./../../Images/star.png')}
                                    fullStar={require('./../../Images/fillStar.png')}
                                    halfStar={require('./../../Images/fillStar.png')}
                                    rating={this.state.starCount}
                                    selectedStar={(rating) => this.onStarRatingPress(rating)}
                                    containerStyle = {{padding: width * 0.1, marginTop: height * 0.1}}
                                    starStyle = {{width: width* 0.1, height: width* 0.1}}
                                />

                                <TouchableOpacity
                                    style = {{width: width * 0.7,
                                              height: height * 0.08,
                                              backgroundColor: 'orange',
                                              marginTop: height * 0.11,
                                              justifyContent: 'center',
                                              marginLeft: width * 0.05,
                                              borderRadius: 5,
                                              elevation: 4}}
                                    onPress={this._toggleModal}
                                >
                                    <Text style = {{fontSize: 20,
                                                    fontWeight: 'bold',
                                                    color: 'white',
                                                    marginLeft: width * 0.26,}}
                                    >
                                        Submit
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
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