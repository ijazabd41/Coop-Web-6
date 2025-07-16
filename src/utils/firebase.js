import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { setFcmToken } from "@/redux/slices/userSlice";
import { createStickyNote } from "./stickynote";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
let messaging = null;

const getMessagingInstance = async () => {
  if (messaging) return messaging;
  if (typeof window === "undefined") return null;

  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      messaging = getMessaging(app);
      return messaging;
    } else {
      console.log("Firebase Messaging is not supported in this browser.");
      createStickyNote();
      return null;
    }
  } catch (err) {
    console.error("Error checking messaging support:", err);
    return null;
  }
};

export const registerServiceWorker = () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log(
          "Service Worker registration successful, scope is:",
          registration.scope
        );
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  }
};

export const fetchToken = async (dispatch) => {
  try {
    const messagingInstance = await getMessagingInstance();
    if (!messagingInstance) {
      console.log("Messaging not initialized, can't fetch token.");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Unable to get permission to notify.");
      return;
    }

    const currentToken = await getToken(messagingInstance, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {
      console.log("FCM Token retrieved:", currentToken);
      dispatch(setFcmToken({ data: currentToken }));
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.error("An error occurred while retrieving token.", err);
  }
};

export const onMessageListener = () => {
  return new Promise(async (resolve) => {
    const messagingInstance = await getMessagingInstance();
    if (messagingInstance) {
      onMessage(messagingInstance, (payload) => {
        console.log("Foreground message received. ", payload);
        resolve(payload);
      });
    } else {
      resolve(null);
    }
  });
};

export { app, auth };
