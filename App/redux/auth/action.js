
import firebase from 'react-native-firebase';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const db = firebase.firestore()

export const onLogin = (phoneNo) => {
    return dispatch => {
        db.collection("users").where("phoneNo", "==", phoneNo).get()
            .then((res)=>{
                let user = res._docs[0]._data
                dispatch({
                    type: LOGIN,
                    payload: {phoneNo, user}
                });
            })
            .catch((err)=>{

            })
    };

};

export const logout = (payload) => {
    type: LOGOUT,
        payload
};