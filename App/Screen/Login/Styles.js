import { Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window');


const Styles = {
    footer:{
        height:height*0.08,
        alignItems:'center',
        justifyContent:'center'
    },
    footerText:{
        fontSize:18,
        color:'white'
    },
    header:{
        width:width,
        height: height* 0.08,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#ff8c00',
        elevation: 2
    },
    headerText:{
        fontSize:18,
        fontWeight: 'bold',
        color:'#fff',
        fontFamily : 'monospace'
    },
    phoneInput: {
        height: height * 0.08,
        width: width * 0.8,
        borderColor: '#ff8c00',
        borderWidth: 2,
        marginTop: height * 0.05,
        marginLeft: height* 0.02,
        backgroundColor: 'white',
        marginLeft: width * 0.1
    },
    loginBtn: {
        width:width*0.8,
        height: height*0.09,
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent:'center',

        backgroundColor: '#ff8c00',
        borderColor: 'white',
        borderWidth: 1,
        marginLeft: width * 0.1,
        marginTop: height * 0.14,
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