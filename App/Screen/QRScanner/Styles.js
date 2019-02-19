import { Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window');


const Styles = {
    container:{
        flex: 1,

    },
    header:{
        width:width,
        height: height* 0.1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'orange'
    },
    headerText:{
        fontSize:18,
        fontWeight: 'bold',
        color:'#fff',
        fontFamily : 'monospace'
    },
}
export default Styles