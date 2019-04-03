import {Dimensions} from 'react-native'
const {width, height} = Dimensions.get('window');
const Styles = {
    main:{
        width: width,
        height:height
    },
    headerImg:{
        width:25,
        height:25
    },
    sub:{
        flex: 1,
        flexDirection: 'column'
    },
    headerMain:{
        height:height*0.1,
        backgroundColor: '#127c7e'
    },
    headerMain2:{
        height:height*0.1,
        backgroundColor: '#127c7e'
    },
    headerSub:{
        flex: 1,
        flexDirection: 'row'
    },
    headerBack:{
        flex:0.2,
        alignItems:'center',
        justifyContent:'center'
    },
    headerHeading:{
        flex:0.8,
        justifyContent:'center',

    },
    headerText:{
        fontSize:18,
        marginLeft:width*0.14,
        fontFamily: 'gt-walsheim-regular',
        color:'#fff'
    },
    subMain:{
        flex:0.9
    },
    subMain2:{
        flex:0.9,
        marginTop:height*0.2
    },
    subSub:{
        flex: 1,
        flexDirection: 'column'
    },
    profilePicCont:{
        height:height*0.2,
        alignItems:'center',
        justifyContent:'center'
    },
    picSub:{
        width:width*0.2,
        height:width*0.2,
        borderRadius:100,
        borderWidth:1,
        borderColor:'grey',
        alignItems:'center',
        justifyContent:'center'
    },
    pic:{
        width:60,
        height:60,
        borderRadius:100
    },
    formMain:{
        height: height * 0.45,
        width:width,
        alignItems:'center'
    },
    formMain2:{
        flex:0.25,
        width:width,
        alignItems:'center'
    },

    footerText:{
        fontSize:18,
        color:'#127c7e',
        fontFamily: 'gt-walsheim-regular'
    },
    footerMain:{
        width:width*0.8,
        height: height*0.09,
        backgroundColor:'white',
        alignItems: 'center',
        justifyContent:'center',
        marginTop: height * 0.05,
        backgroundColor: '#ff8c00',
        borderColor: 'white',
        borderWidth: 1,

        elevation: 4
    },
    footerMain2:{
        flex:0.3,
        alignItems:'center',
        justifyContent:'center',
        marginTop: height*0.1
    },
    btn:{
        fontSize: 18,
        color: 'white',
        fontFamily: 'monospace',
        fontWeight: 'bold'
    },
    btn2:{
        width: width* 0.7,
        height: height*0.07,
        borderRadius:7,
        marginTop:height*0.03,
        justifyContent:'center',
        alignItems:'center'
    },

    btnText:{
        fontSize:18,
        color:'white',
        fontFamily: 'gt-walsheim-regular'
    },
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
};

export default Styles;