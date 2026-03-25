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

// self.addEventListener("notificationclick", (event) => {
//   event.notification.close();

//   const { url } = event.notification.data || {};
//   const targetUrl = url || "/";


//   event.waitUntil(
//     clients
//       .matchAll({ type: "window", includeUncontrolled: true })
//       .then(async (clientList) => {
//         // Try to focus an existing tab and navigate it
//         for (const client of clientList) {
//           if (client.url && "focus" in client) {
//             try {
//               await client.focus();
//               await client.navigate(targetUrl);
//               return;
//             } catch (err) {
//               console.warn("client.navigate failed, opening new window:", err);
//             }
//           }
//         }
//         return clients.openWindow(targetUrl);
//       })
//   );
// });

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { url } = event.notification.data || {};
  const targetUrl = url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        const sameOriginClient = clientList.find(
          (c) => new URL(c.url).origin === self.location.origin
        );

        if (sameOriginClient) {
          // ✅ Tab already open — postMessage to navigate
          sameOriginClient.postMessage({
            type: "NOTIFICATION_CLICK",
            url: targetUrl,
          });
          console.log("target url",targetUrl)
          return sameOriginClient.focus();
        }

        // ✅ No tab open — open the URL directly (no postMessage needed)
        return clients.openWindow(targetUrl);
      })
  );
});

function getRedirectUrl(data) {
  const { type, id,type_slug } = data;
  console.log("data",data)
  const base = self.location.origin;
  console.log("type",type)
  switch (type) {
    case "order":
      return `${base}/order-detail/${id}`;
    case "product":
      return `${base}/product/${type_slug}`;
    case "category":
      return `${base}/categories/${type_slug}`;
    case "wallet":
      return `${base}/profile/wallethistory`;
    case "notification":
      return `${base}/profile/notifications`;
    default:
      return `${base}/`;
  }
}
