const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


exports.sendNotification = functions.firestore.document('/messages/{roomId}/message/{messageId}')
        .onCreate((event) => {

        console.info("event data >>>", event.data())
let resieverId = event.data().recieverId;
let senderId = event.data().senderId;
return admin.firestore().collection("users").doc(senderId).get().then((user) => {

        if (!user.data()) return;

const snapshot = user.data();
const payload = {
    notification: {
        title: `New Message From ${snapshot.name}`,
body: event.data().message,
    icon: snapshot.profileImg,
}
}
return admin.firestore().collection("users").doc(event.data().recieverId)
        .get().then(reciever => {
        console.info("reciever", reciever)
return admin.messaging().sendToDevice(reciever.data().token, payload);
})


});
})