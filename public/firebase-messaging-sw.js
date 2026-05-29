importScripts(
  "https://www.gstatic.com/firebasejs/11.1.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "FIREBASE_API_KEY_HERE",
  authDomain: "FIREBASE_AUTH_DOMAIN_HERE",
  projectId: "FIREBASE_PROJECT_ID_HERE",
  storageBucket: "FIREBASE_STORAGE_BUCKET_HERE",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
  appId: "FIREBASE_APP_ID",
  measurementId: "FIREBASE_MEASUREMENT_ID",
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
    image: payload.data.image,
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

  const productRequestURL = type_slug == "" ? `${base}/profile/requested-products` : `${base}/product/${type_slug}`;

  switch (type) {
    case "order":
      return `${base}/order-detail/${id}`;
    case "product":
      return `${base}/product/${type_slug}`;
    case "category":
      return `${base}/categories/all`;
    case "cart":
      return `${base}/checkout`;
    case "product_request":
      return productRequestURL;
    default:
      return `${base}/`;
  }
}
