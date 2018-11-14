import React, {Component} from 'react';
import {View, Text, Dimensions, Image, TouchableOpacity,TextInput,ActivityIndicator,Alert} from 'react-native'
import Styles from './Styles'
import { TextField } from 'react-native-material-textfield';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {updateVehicles} from './../../Config/Firebase'
const {width, height} = Dimensions.get('window');

const items = [
    {
        name: "Suzuki",
        id: 0,
        children: [{
            name: "Mehran",
            id: "Mehran",
        },{
            name: "Cultus",
            id: "Cultus",
        },{
            name: "Wagon R",
            id: "Wagon R",
        },{
            name: "APV",
            id: "APV",
        },{
            name: "Bolan",
            id: "Bolan",
        },{
            name: "Jimny",
            id: "Jimny",
        }]
    },
    {
        name: "Honda",
        id: "Honda",
        children: [{
            name: "Civic",
            id: "Civic",
        },{
            name: "Accord",
            id: "Accord",
        },{
            name: "City",
            id: "City",
        },{
            name: "BR-V",
            id: "BR-V",
        }]
    },
    {
        name: "Toyota",
        id: 2,
        children: [{
            name: "Corolla",
            id: "Corolla",
        },{
            name: "Fortuner",
            id: "Fortuner",
        },{
            name: "Hiace",
            id: "Hiace",
        },{
            name: "Hilux",
            id: "Hilux",
        }]
    },
]

export default class UpdatePassword extends Component{

    constructor(props){
        super(props);
        this.state = {
            loader : false,
            user: this.props.navigation.getParam('user'),
            selectedItems: []
        };
        this.updateVehicles = this.updateVehicles.bind(this);
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
    }

    async updateVehicles(){
        const {selectedItems, user} = this.state;
        this.setState({loader: true});
        const res = await updateVehicles(user.id, selectedItems);
        if(res == "Vehicles updated"){
            this.setState({loader: false});
            Alert.alert('','Vehicles Updated')
        }
    }

    render(){

        return(
            <View style={Styles.main}>
                <View style={Styles.headerMain}>
                    <View style={Styles.headerSub}>
                        <View style={Styles.headerBack}>
                            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                                <Image source={require('../../Images/leftArrow.png')} style={Styles.headerImg}/>
                            </TouchableOpacity>
                        </View>
                        <View style={Styles.headerHeading}>
                            <Text style={Styles.headerText}>Update Profile</Text>
                        </View>
                    </View>
                </View>

                    <View style={{width: width, height: height*0.07, marginTop: height * 0.37}}>

                        <SectionedMultiSelect
                            items={items}
                            uniqueKey='id'
                            subKey='children'
                            selectText='Choose your vehicles...'
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={this.onSelectedItemsChange}
                            selectedItems={this.state.selectedItems}
                            showChips = {true}
                            modalAnimationType = 'fade'
                            dropDownToggleIconUpComponent = {true}
                            animateDropDowns = {true}
                            selectLabelNumberOfLines = {4}
                        />

                    </View>
                <View style={{flex:0.2, alignItems:'center', justifyContent:'center', marginTop: height * 0.3}}>
                    <TouchableOpacity
                        onPress={()=>{this.updateVehicles()}}
                        style={Styles.btn}>
                        {this.state.loader ? <ActivityIndicator size="small" color="#0000ff"/> :
                            <Text style={Styles.btnText}>Update Vehicles</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

