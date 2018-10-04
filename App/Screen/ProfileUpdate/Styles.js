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
        flex:1,
        width:width,
        alignItems:'center'
    },
    formMain2:{
        flex:0.25,
        width:width,
        alignItems:'center'
    },
    inputField:{
        width: width* 0.7,
        height: height*0.07,
        marginBottom: height * 0.025
    },
    footerText:{
        fontSize:18,
        color:'#127c7e',
        fontFamily: 'gt-walsheim-regular'
    },
    footerMain:{
        flex:0.2,
        alignItems:'center',
        justifyContent:'center'
    },
    footerMain2:{
        flex:0.3,
        alignItems:'center',
        justifyContent:'center',
        marginTop: height*0.1
    },
    btn:{
        width: width* 0.7,
        height: height*0.07,
        borderRadius:7,
        backgroundColor:'#127c7e',
        marginTop:height*0.03,
        justifyContent:'center',
        alignItems:'center'
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
    }
};

export default Styles;