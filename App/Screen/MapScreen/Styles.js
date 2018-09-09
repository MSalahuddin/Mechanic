import { Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window');


const Styles = {
    header:{
        flex:0.1,
        flexDirection: 'row',
        backgroundColor: '#127c7e'

    },
    headerSubContent:{
        width: width* 0.1,
        height: height * 0.1,
        alignItems:'center',
        justifyContent:'center'
    },
    menuImg:{
        marginBottom: height * 0.02,
        width: width* 0.07,
        height: height * 0.035,
        marginLeft:10
    },
}
export default Styles
