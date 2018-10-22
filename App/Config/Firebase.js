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
                resolve("Position Updated");
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
        db.collection('users').doc(userId).collection('pushReq').add({
                mechanicId: id,
                userId:userId,
                message: "Someone calling you",
                createdAt: Date.now(),
                token: token,

            })
            .then((res)=>{
                resolve(res);
            })
            .catch((err)=>{
                console.log(err,'---------------------')
                reject(err)
            })
    })
};

const uploadImage = (userId, image) => {
    var storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('images/profile_'+ userId +'.jpg');
    return new Promise((resolve, reject) => {
        imagesRef.put(image, { contentType: image })
            .then(function(snapshot) {
                imagesRef.getDownloadURL().then(function(url) {
                    resolve(url);
                }).catch(function(error) {
                    reject({error: error.message})
                });
            }).catch((e) => {
            reject({error: e.message})
        });
    })
};

const updateProfile = (userId, params) => {
    return new Promise((resolve, reject)=>{
        db.collection('users').doc(userId).update(params)
            .then((res)=>{
                resolve("Profile update successfully")
            })
        .catch((err)=>{
            reject(err)
        })
    })

};

const upateMechaincJobs = (jobId, mechanicId) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(mechanicId).update({jobs: jobId})
        .then((res) => {
            resolve(res)
        })
    });
};

const getMechanicData = (userId) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(userId).get()
        .then(snapshot => {
            resolve(snapshot.data())
        })
    })
}

const acceptJobReq = (jobId, userId) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(userId).collection('pushReq').doc(jobId).collection('jobStatus').add({
            JobStatus: 'Accept'
        })
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        })
    })
}
export {
    loginUser,
    signUp,
    filterMechanic,
    setDeviceToken,
    signOut,
    SetPosition,
    pushReq,
    uploadImage,
    updateProfile,
    upateMechaincJobs,
    getMechanicData,
    acceptJobReq
}