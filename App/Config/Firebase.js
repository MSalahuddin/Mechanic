import firebase from 'react-native-firebase';
const db = firebase.firestore()

const loginUser = (phoneNo) => {
    return new Promise((resolve, reject) => {
        db.collection("users").where("phoneNo", "==", phoneNo).get()
            .then((res)=>{
                if(res._docs[0]._data.phoneNo == phoneNo){
                    firebase.auth().signInWithPhoneNumber(phoneNo)
                        .then(confirmResult => {
                            resolve(confirmResult)
                        })
                }
                else{
                    let msg = "please first signup"
                    reject(msg)
                }
            })
            .catch((err)=>{
            })
    })
};

const signUp = (phoneNo) => {
    return new Promise((resolve, reject) => {
        firebase.auth().signInWithPhoneNumber(phoneNo)
            .then((confirmResult) => {
                resolve(confirmResult)
            })
            .catch((error) => {
                reject(error)
            });
    });
}

export {
    loginUser,
    signUp
}