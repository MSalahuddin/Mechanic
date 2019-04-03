import { Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window');


const Styles = {
    header:{
        height: height*0.08,
        flexDirection: 'row',
        backgroundColor:'#ff8c00',
        elevation: 2
    },
    headerSub:{
        width: width*0.15,
        height: height*0.08,
        alignItems:'center',
        justifyContent:'center'
    },
    headerImg:{
        width: 25,
        height: 25
    },
    headingText:{
        fontWeight: 'bold',
        color:'#fff',
        fontFamily : 'monospace',
        fontSize:18
    },
    headingDiv:{
        width: width*0.85,
        height: height*0.08,
        justifyContent:'center',
        marginLeft:width*0.1
    },
    footer:{
        height:height*0.08,
        alignItems:'center',
        justifyContent:'center'
    },
    footerText:{
        fontSize:18,
        color:'red'
    },
    inputField:{
        width: width* 0.8,
        height: height*0.1,
        color: 'white',
        fontSize: 16
    },
    seperator: {
        // flex: 1,
        height: 1,
        backgroundColor: '#c5c5c5',
        width: width * 0.8,
        opacity: 0.7,
        marginVertical: width * 0.005
    },
    signupButton: {
        width:width*0.8,
        height: height*0.09,
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: '#ff8c00',
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
        marginTop: height * 0.03,
        elevation: 4
    },
    codeInput: {
        height: height * 0.15,
        width: width ,
        textAlign: "center",
        color: '#ff8c00',
        fontSize: 30,
    }
}
export default Styles