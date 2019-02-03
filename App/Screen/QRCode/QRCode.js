import React,{Component} from 'react';
import {View,Text, Image, Dimensions, TouchableOpacity, TextInput, StyleSheet} from 'react-native';
import Styles from './Styles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import QRCode from 'react-native-qrcode';
const {height, width} = Dimensions.get('window')
import QRCodeScanner from 'react-native-qrcode-scanner';
class QRCodeScreen extends Component{
    static navigationOptions = {
        header : null
    };

    constructor(props){
        super(props);
        this.state = {
            text: "QRCode"
        }

    }

    onSuccess(e) {
        Linking
            .openURL(e.data)
            .catch(err => console.error('An error occured', err));
    }


    render(){
        return(
            <View>
                <View style={Styles.header}>
                    <Text style={Styles.headerText}>QR Code</Text>
                </View>
                <View style = {{width : width, height: height * 0.9, alignItems: 'center', justifyContent: 'center'}}>
                    {/*<QRCode
                        value={this.state.text}
                        size={200}
                        bgColor='black'
                        fgColor='white'/>*/}
                    <QRCodeScanner
                        onRead={this.onSuccess.bind(this)}
                        topContent={
          <Text style={styles.centerText}>
            Go to <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on your computer and scan the QR code.
          </Text>
        }
                        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
                    />
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