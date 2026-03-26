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

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data:{
       type: payload.data.type, 
       slug: payload.data.type_slug,
       id: payload.data.id, 
       url: getRedirectUrl(payload.data)
    }
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a tab is already open at that URL, focus it
        for (const client of clientList) {
          if (client.url === targetUrl && "focus" in client) {
            return client.focus();
          }
        }
        // Otherwise open a new window — this is valid because we're
        // still inside the notificationclick trusted event context
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});

function getRedirectUrl(data) {
  const { type, id,type_slug } = data;
  const base = self.location.origin;

  switch (type) {
    case "order":
      return `${base}/order-detail/${id}`;
    case "product":
      return `${base}/product/${type_slug}`;
    case "category":
      return `${base}/categories/all`;
    case "cart":
      return `${base}/checkout`;
    default:
      return `${base}/`;
  }
}
