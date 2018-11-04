import React, {Component} from 'react';
import {View, Text, Dimensions, Image, TouchableOpacity,TextInput,ActivityIndicator,Alert} from 'react-native'
import Styles from './Styles'
import { TextField } from 'react-native-material-textfield';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const {width, height} = Dimensions.get('window');

const items = [
    {
        name: "Suzuki",
        id: 0,
        children: [{
            name: "Apple",
            id: 10,
        },{
            name: "Strawberry",
            id: 17,
        },{
            name: "Pineapple",
            id: 13,
        },{
            name: "Banana",
            id: 14,
        },{
            name: "Watermelon",
            id: 15,
        },{
            name: "Kiwi fruit",
            id: 16,
        }]
    },
    {
        name: "Gems",
        id: 1,
        children: [{
            name: "Quartz",
            id: 20,
        },{
            name: "Zircon",
            id: 21,
        },{
            name: "Sapphire",
            id: 22,
        },{
            name: "Topaz",
            id: 23,
        }]
    },
    {
        name: "Plants",
        id: 2,
        children: [{
            name: "Mother In Law\'s Tongue",
            id: 30,
        },{
            name: "Yucca",
            id: 31,
        },{
            name: "Monsteria",
            id: 32,
        },{
            name: "Palm",
            id: 33,
        }]
    },
]

export default class UpdatePassword extends Component{

    constructor(props){
        super(props);
        this.state = {
            OldPassword: '',
            NewPassword: '',
            ReType: '',
            loader : false
        };

    }

    validate() {
        const {OldPassword, NewPassword,ReType} = this.state;
        if (!OldPassword || !NewPassword ) {
            Alert.alert('','Enter All Fields.');
            return false;
        } else if (NewPassword.length < 8) {
            Alert.alert('','Minimum length of password field is 8 characters');
            return false;
        } else if (NewPassword.length > 16) {
            Alert.alert('','Maximum length of password field is 16 characters');
            return false;
        }
        else if (NewPassword != ReType) {
            Alert.alert('','Passwords do not match.');
            return false;
        }
        return true;
    }

    async updatePassword() {

        const {OldPassword, NewPassword, ReType} = this.state;
        if (this.validate()) {
            try {
                this.setState({loader: true});
                await updatePassword(OldPassword, NewPassword);
                this.setState({loader : false , OldPassword : '', NewPassword : '', ReType : ''})
            } catch (e) {
                this.setState({loader : false});
                Alert.alert('', e.error)
            }
        }
    }

    onSelectedItemsChange = (selectedItems) => {
        this.setState({ selectedItems });
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
            </View>
        )
    }
}

