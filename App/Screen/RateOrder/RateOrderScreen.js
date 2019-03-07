import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, Alert, ToastAndroid} from 'react-native';
import Styles from './Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'react-native-firebase';
import _ from 'underscore';
import Modal from "react-native-modal";
import StarRating from 'react-native-star-rating';

const {height, width} = Dimensions.get('window')
const db = firebase.firestore();

class RateOrderScreen extends Component{
    static navigationOptions = {
        header : null
    };

    constructor(props){
        super(props);
        this.state = {
            isModalVisible: false,
            starCount: 3.5,
            showToast: false,
            mechanicDetails: this.props.navigation.getParam('mechanicDetails')
        }

    }

    componentWillMount(){
        this._toggleModal();
    }

    showToast = (message) =>{
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT
        );
    }

    _toggleModal = () =>
        this.setState({ isModalVisible: !this.state.isModalVisible });

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    submitRating = () => {
        const {starCount, mechanicDetails} = this.state;
        const mechaicId = mechanicDetails.id;
        const ratingArray = mechanicDetails.rating;
        ratingArray.push(starCount);
        const sumRating = _.reduce(ratingArray, (memo, num) => { return memo + num; }, 0);
        const avgRating = sumRating / ratingArray.length;
        console.log(avgRating,'avgRating');
        db.collection('users').doc(mechaicId).update({
            rating: ratingArray,
            avgRating: avgRating
        }).then((res) => {
            this.setState({isModalVisible: false});
            this.showToast('Thanks for your quick response');
            console.log(res, 'response')

        }).catch((err) => {
            this.showToast('Something goes wrong')
            console.log(err,'error')
        })
    }


    render(){

        return(
            <View>
                <View style={Styles.header}>
                    <Text style={Styles.headerText}>QR Code</Text>
                </View>
                <View style = {{width : width, height: height * 0.9, alignItems: 'center', justifyContent: 'center'}}>

                     <View style={{ flex: 1 }}>
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
                     onPress={this.submitRating}
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
)(RateOrderScreen)