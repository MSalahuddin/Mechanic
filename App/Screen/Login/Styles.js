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
        color:'red'
    },
    header:{
        width:width,
        height: height* 0.1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: '#7085a5'
    },
    headerText:{
        fontSize:18,
        fontWeight: 'bold',
        color:'#fff',
        fontFamily : 'monospace'
    },
}
export default Styles