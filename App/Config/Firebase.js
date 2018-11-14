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

const pushReq = (user, id, token)=>{
    const userId = user.id;
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

const upateMechaincJobs = (jobId, mechanicId, updateStatusId) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(mechanicId).update({jobs: jobId, jobStatusId: updateStatusId})
        .then(snapshot => {
            resolve('Update successfully')
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

const createJobReq = (jobId, userId) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(userId).collection('pushReq').doc(jobId).collection('jobStatus').add({
            jobStatus: 'pending',
            userLoc: {
                latitude: '',
                longitude: ''
            },
            mechanicLoc: {
                latitude: '',
                longitude: ''
            }
        })
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        })
    })
}
const acceptJobReq = (currentJob, notificationData, user) => {
    console.log(user,'lllllllllllllllllll9999999999999999000000000000')
    const userId = notificationData.id;
    return new Promise((resolve, reject) => {
        db.collection('users').doc(userId).collection('pushReq').doc(currentJob.jobId).collection('jobStatus').doc(currentJob.jobStatusId).update({
                jobStatus: 'Accept',
                userLoc: {
                    latitude: notificationData.coordinates.latitude,
                    longitude: notificationData.coordinates.longitude
                },
                mechanicLoc: {
                    latitude: user.latitude,
                    longitude:user.longitude
                }
            })
            .then((res) => {
                resolve('Job Accepted Successfully');
            })
            .catch((err) => {
                reject(err);
            })
    })
}

const JobReqRes = (jobId, userId, statusId) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(userId).collection('pushReq').doc(jobId).collection('jobStatus').doc(statusId)
            .onSnapshot(function(doc) {
                resolve(doc.data())

            });

    })
}
const CalDistance = ((mecLang, machLat, userLang, userLat) => {
    let apiKey = 'gakuxByYEFeTnvwsASJ0acSgMovLmPm5';
    let dummyLang = 67.350338;
    let dummyLat = 24.8731142;
    return new Promise((resolve, reject) => {
        fetch(`https://www.mapquestapi.com/directions/v2/route?key=${apiKey}&from=${userLat},${userLang}&to=${machLat},${mecLang}&outFormat=json&ambiguities=ignore&routeType=bicycle&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false`)
        .then((response) => {
            return response.json();
        })
        .then((res) => {
            resolve(res)
        })
    })
})

const updateVehicles = (id, vehicles) => {
    return new Promise((resolve, reject) => {
        db.collection('users').doc(id).update({
            vehicles: vehicles
        })
        .then((res) => {
            resolve("Vehicles updated")
        })
        .catch((err) => {
            reject(err)
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
    acceptJobReq,
    createJobReq,
    JobReqRes,
    CalDistance,
    updateVehicles
}