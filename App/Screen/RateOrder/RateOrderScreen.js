import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet, Alert, ToastAndroid} from 'react-native';
import Styles from './Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import firebase from 'react-native-firebase';
import _ from 'underscore';
import Modal from "react-native-modal";
import StarRating from 'react-native-star-rating';
import { Dropdown } from 'react-native-material-dropdown';

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
            starCount: 0,
            showToast: false,
            serviceCharges: 0,
            services: '',
            reviewComment: "",
            mechanicDetails: this.props.navigation.getParam('mechanicDetails'),
            redirectMap: this.props.navigation.getParam('redirectMap')
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

    setReviews = () => {
        const {mechanicDetails, reviewComment} = this.state;
        const {user} = this.props;
        const userImage = user.profilePicture ? user.profilePicture : undefined
        db.collection('users').doc(mechanicDetails.id).get().then(snapshot => {
            console.log(snapshot.data().reviews,'///////////////mechanicdata')
            let reviews = snapshot.data().reviews ? snapshot.data().reviews: []
            reviews.push(
                {comment: reviewComment,
                 firstname: user.firstName,
                 lastname: user.lastName,
                 profilePicture: userImage,

                }
            )
            db.collection('users').doc(mechanicDetails.id).update(
                {
                    reviews: reviews
                }
            ).then((res) => { this.updateJobData() })
        })
    }

    updateJobData = () => {
        const {redirectMap} = this.state;
        this.showToast('Thanks for your quick response');
        setTimeout(()=> {
            this.setState({isModalVisible: false});
            redirectMap()
            this.props.navigation.navigate("MapScreen", {screen: "MapScreen"})
        },1000)
    }

    addJobsData = (mechaicId) => {
        const {serviceCharges, services} = this.state;
        const date = new Date().toISOString().slice(0,10);
        const jobList = [];
        jobList.push(services)
        const admincharges = 5 / 100 * serviceCharges;
        db.collection('users').doc(mechaicId).collection('jobs').add({
            adminCharges: admincharges,
            jobCharges: serviceCharges,
            jobDate: date,
            jobList: jobList,
            payment: 'pending',
            status: "Completed"
        })
        .then((res)=>{
            this.setReviews();
            console.log(res,'kkkkkkkkkkkkkkkkkkkkkk')
            
        })
        .catch((err)=>{
            console.log(err,'---------------------')
            
        })
    }
    submitRating = () => {
        const {starCount, mechanicDetails} = this.state;
        const mechaicId = mechanicDetails.id;
        const ratingArray = mechanicDetails.rating ? mechanicDetails.rating : []
        
        ratingArray.push(starCount);
        const sumRating = _.reduce(ratingArray, (memo, num) => { return memo + num; }, 0);
        const avgRating = sumRating / ratingArray.length;
        
        db.collection('users').doc(mechaicId).update({
            rating: ratingArray,
            avgRating: avgRating
        }).then((res) => {
            
            console.log(res, 'response')

        }).catch((err) => {
            this.showToast('Something goes wrong')
            console.log(err,'error')
        })
        this.addJobsData(mechaicId);
    }


    render(){
        let serviceCharges = [{
            value: 100,
          }, {
            value: 150,
          }, {
            value: 200,
          },{
            value: 300,
          }, {
            value: 400,
          }, {
            value: 500,
          },{
            value: 1000,
          }, {
            value: 1500,
          }, {
            value: 2000,
          }];
          let services = [{
            value: "Electrical Check",
          }, {
            value: "Engine oil Change",
          }, {
            value: "Filter Change",
          },{
            value: "Mechanical Check",
          }, {
            value: "Steering Alignment",
          }, {
            value: "Wheel Balancing",
          },{
            value: "Wheels Alignment",
          }];
        return(
            <View>
                <View style={Styles.header}>
                    <Text style={Styles.headerText}>Rate Order</Text>
                </View>
                <View style = {{width : width, height: height * 0.9, alignItems: 'center', justifyContent: 'center'}}>

                     <View style={{ flex: 1 }}>
                     <Modal
                     //onBackdropPress = {() => this.setState({isModalVisible: false})}
                     //onBackButtonPress = {() => this.setState({isModalVisible: false})}
                     isVisible={this.state.isModalVisible}
                     >
                     <View style={{ width: width * 0.8,
                     height: height * 0.65,
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
                     
                    
                        <View style = {{height: height * 0.1}}>
                        <Dropdown
                            label='Service Charges'
                            animationDuration = {200}
                            fontSize = {16}
                            labelFontSize = {16}
                            textColor = '#ff8c00'
                            baseColor = '#4d4d4d'
                            itemColor = "#ff8c00"
                            selectedItemColor = 'white'
                            itemCount = {4}
                            itemPadding = {2}
                            pickerStyle = {{width: width * 0.4, height: height* 0.2, marginLeft: width * 0.4, marginTop: height * 0.1, backgroundColor: "#4d4d4d"}}
                            value = {this.state.serviceCharges}
                            data={serviceCharges}
                            onChangeText = {(serviceCharges) => {this.setState({serviceCharges: serviceCharges})}}
                        />
                        </View>
                        <View style = {{height: height * 0.1, }}>
                        <Dropdown
                            label='Services'
                            animationDuration = {200}
                            fontSize = {16}
                            labelFontSize = {16}
                            textColor = '#ff8c00'
                            baseColor = '#4d4d4d'
                            itemColor = "#ff8c00"
                            selectedItemColor = 'white'
                            itemCount = {4}
                            itemPadding = {2}
                            pickerStyle = {{width: width * 0.6, height: height* 0.2, marginLeft: width * 0.2, marginTop: height * 0.1, backgroundColor: "#4d4d4d"}}
                            value = {this.state.services}
                            data={services}
                            onChangeText = {(services) => {this.setState({services: services})}}
                        />
                        </View>
                        <View style = {{ height: height * 0.1, marginTop: height * 0.02}}> 
                            <TextInput 
                                style = {{fontSize: 16, height: height * 0.082}}
                                underlineColorAndroid = 'transparent'
                                multiline = {true}
                                placeholder = "Review Comment"
                                value = {this.state.reviewComment} 
                                onChangeText = {(comment) => {this.setState({reviewComment: comment})} }
                                placeholderTextColor = "#4d4d4d"
                                />
                        </View>
                        <View style = {{flexDirection: 'row', marginTop: height * 0.03}}>
                            <Text style = {{color: '#4d4d4d', fontSize: 16}}>Ratings:</Text>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                emptyStar={require('./../../Images/star.png')}
                                fullStar={require('./../../Images/fillStar.png')}
                                halfStar={require('./../../Images/fillStar.png')}
                                rating={this.state.starCount}
                                selectedStar={(rating) => this.onStarRatingPress(rating)}
                                containerStyle = {{ paddingTop: 0, marginTop: height * 0.005, marginLeft: width * 0.13}}
                                starStyle = {{width: width* 0.05, height: width* 0.05, paddingLeft: width * 0.05, paddingRight: width * 0.05}}
                            />
                        </View>
                        <TouchableOpacity
                            style = {{width: width * 0.7,
                            height: height * 0.08,
                            backgroundColor: 'orange',
                            marginTop: height * 0.05,
                            justifyContent: 'center',
                            marginLeft: width * 0.05,
                            borderRadius: 5,
                            elevation: 4}}
                            onPress={this.submitRating}
                            >
                            <Text 
                                style = {{fontSize: 20,
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