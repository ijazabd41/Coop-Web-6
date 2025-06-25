importScripts(
  "https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBT3LL_VaQavGOX8hV8kRSLpWrkbBKX8io",
  authDomain: "egrocer-457a9.firebaseapp.com",
  projectId: "egrocer-457a9",
  storageBucket: "egrocer-457a9.appspot.com",
  messagingSenderId: "755773183987",
  appId: "1:755773183987:web:79da7c0c3f815e4793e486",
  measurementId: "G-CZXY4LTFRH",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
