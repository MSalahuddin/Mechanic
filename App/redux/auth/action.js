
import firebase from 'react-native-firebase';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

const db = firebase.firestore()

export const onLogin = (payload) => {
    return dispatch => {
        db.collection("users").doc(payload)
            .onSnapshot((doc) => {
                let user = doc.data();
                let userId = {id: payload };
                console.log("Current data: ", doc.data());
                dispatch({
                    type: LOGIN,
                    payload: {...userId, ...user}
                });
            }, (e) => {
                console.log('Something Went Wrong from onLogin Redux');
            });
    };

};

export const logout = (payload) => {
    type: LOGOUT,
        payload
};