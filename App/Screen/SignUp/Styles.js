import { Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window');


const Styles = {
    header:{
        flex: 1,
        flexDirection: 'row',
        backgroundColor:'#7085a5'
    },
    headerSub:{
        width: width*0.15,
        height: height*0.1,
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
        height: height*0.1,
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
        width: width* 0.7,
        height: height*0.1,
        borderWidth:0.5,
        fontSize:16,
        marginRight: 5,
        borderBottomColor:'grey',
        borderRightColor:'transparent',
        borderLeftColor:'transparent',
        borderTopColor:'transparent'
    },
}
export default Styles