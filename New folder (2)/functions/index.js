const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendNotification = functions.firestore.document('/users/{userId}/pushReq/{reqId}')
        .onWrite((event) => {

        console.info("event After >>>", event.after.data());
        console.info();
        let mechanicId = event.after.data().mechanicId;
        let userId = event.after.data().userId;

return admin.firestore().collection("users").doc(userId).get().then((user) => {

            if (!user.data()) return;
console.info('userrrrrrrrrrrrr',user.data())
const snapshot = user.data();
const phoneNo = snapshot.phoneNo.toString();
const longitude = snapshot.longitude.toString();
const latitude = snapshot.latitude.toString();
const payload = {
    notification: {
        title: `New Message From ${snapshot.firstName}  ${snapshot.lastName}`,
        body: event.after.data().message,
            badge: "2",
            sound: 'default',
    },
    data:{
        name: `${snapshot.firstName} ${snapshot.lastName}`,
        phoneNo: phoneNo,
        id: snapshot.id,
        longitude: longitude,
        latitude: latitude,
        profilePicture: snapshot.profilePicture
    }
}
const options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24
}

console.info('payloadddddddd', payload)
return admin.firestore().collection("users").doc(mechanicId)
        .get().then(reciever => {
        console.info('payloadddddddd', payload)
        console.info("reciever", reciever.data())
return admin.messaging().sendToDevice(reciever.data().deviceToken, payload, options)
})


});

});