import firebase from 'react-native-firebase';
const db = firebase.firestore();

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
                    let msg = "please first create an account"
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

const filterMechanic = ()=>{
    return new Promise((resolve, reject) =>{
        db.collection('users').get()
            .then(snapshot => {
                let user = [];
                snapshot.forEach(function(doc) {
                    if (doc.exists) {
                        if(doc.data().isMechanic){
                            user.push(doc.data());
                        }
                    } else {
                        reject(user)
                    }
                });
                resolve(user);
            })
    })
}

const setDeviceToken = (userId, token)=>{
    return new Promise((resolve, reject)=>{
        db.collection('users').doc(userId).update({deviceToken: token})
        .then((res)=>{
            resolve("Device token update successfully");
        })
        .catch((err)=>{
            reject(err)
        })
    })
};

const signOut = (id)=>{
    return new Promise((resolve, reject)=>{
        db.collection('users').doc(id).update({deviceToken: ''})
            .then((res)=>{
                resolve("Device token delete successfully");
            })
            .catch((err)=>{
                reject(err)
            })
    })
};

const SetPosition = (userId, latitude, longitude)=>{
    return new Promise((resolve, reject)=>{
        db.collection('users').doc(userId).update({longitude: longitude, latitude: latitude})
            .then((res)=>{
                resolve(res);
            })
            .catch((err)=>{
                reject(err)
            })
    })
};

const pushReq = (userId, id, token)=>{
    console.log(userId)
    console.log(id)
    console.log(token,']]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]')
    return new Promise((resolve, reject)=>{
        db.collection('users').doc(userId).collection('pushReq').doc(id).set({
            mechanicId: id,
            createdAt: Date.now(),
            token: token,
        })
            .then((res)=>{
                resolve('your request send successfully');
            })
            .catch((err)=>{
                reject(err)
            })
    })
};


export {
    loginUser,
    signUp,
    filterMechanic,
    setDeviceToken,
    signOut,
    SetPosition,
    pushReq
}