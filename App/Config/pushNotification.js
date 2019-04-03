const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const pushNotification = (senderId)=>{
    return new Promise((resolve, reject)=>{
        fexports.sendNotification = functions.firestore.document('/users/{senderId}')
            .onWrite((event) => {

                console.info("event After >>>", event.after)
                let resieverId = event.after.data().recieverId;
                let senderId = event.after.data().senderId;
                return admin.firestore().collection("users").doc(senderId).get().then((user) => {

                    if (!user.data()) return;

                    const snapshot = user.data();
                    const payload = {
                        notification: {
                            title: `New Message From ${snapshot.name}`,
                            body: event.after.data().message,
                            icon: snapshot.profileImg,
                        }
                    }
                    return admin.firestore().collection("users").doc(event.after.data().recieverId)
                        .get().then(reciever => {
                            console.info("reciever", reciever)
                            return admin.messaging().sendToDevice(reciever.data().token, payload);
                        })


                });
            })
    })
}

export {pushNotification}