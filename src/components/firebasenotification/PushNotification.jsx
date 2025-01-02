import { setFcmToken } from "@/redux/slices/userSlice";
import FirebaseData from "@/utils/firebase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const PushNotification = ({ children }) => {
  const dispatch = useDispatch();
  const { messaging, app } = FirebaseData();
  const [notification, setNotification] = useState("");
  const [isAppInitialized, setIsAppInitialized] = useState(false);
  const [token, setToken] = useState("");
  const [isMessagingSupported, setIsMessagingSupported] = useState(true);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false); // Track Firebase init status
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);
  // Initialize Firebase app
  const initializeFirebase = async () => {
    try {
      console.log("Initializing Firebase...");
      if (!app) {
        throw new Error("Firebase app not initialized.");
      }
      setIsFirebaseInitialized(true); // Mark Firebase initialization as complete
    } catch (err) {
      console.error("Error initializing Firebase:", err);
      setIsFirebaseInitialized(false);
    }
  };

  // Function to initialize messaging once Firebase is ready
  const messagingInstance = async () => {
    try {
      const isNotiSupported = await isSupported();
      if (isNotiSupported && app) {
        setIsAppInitialized(true);
        return getMessaging(app); // Return messaging instance if app is initialized
      } else {
        setIsMessagingSupported(false);
        console.error(
          "Push notifications are not supported or Firebase is not initialized."
        );
        return null;
      }
    } catch (err) {
      console.error("Error initializing messaging:", err);
      return null;
    }
  };

  // Register service worker
  const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registration successful with scope:",
            registration.scope
          );
          setIsServiceWorkerRegistered(true);
        })
        .catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
    }
  };

  // Fetch the FCM token after Firebase and service worker are initialized
  const fetchToken = async () => {
    try {
      if (
        typeof window !== "undefined" &&
        "serviceWorker" in navigator &&
        isServiceWorkerRegistered
      ) {
        let messagingInstanceResult = await messagingInstance();
        if (!messagingInstanceResult) {
          console.error("Messaging is not available.");
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const currentToken = await getToken(messagingInstanceResult);
          if (currentToken) {
            handleToken(currentToken);
          } else {
            console.error("No FCM token found.");
          }
        } else {
          console.error("Permission not granted for notifications.");
        }
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  // Handle the FCM token
  const handleToken = (currentToken) => {
    if (currentToken) {
      dispatch(setFcmToken(currentToken));
      setToken(currentToken);
      console.log("FCM Token:", currentToken);
    } else {
      console.error("Failed to retrieve the FCM token.");
    }
  };

  // Call this function sequentially to initialize Firebase, register service worker, and fetch token
  const initializeAndFetchToken = async () => {
    await initializeFirebase(); // Initialize Firebase first
    if (isFirebaseInitialized) {
      registerServiceWorker(); // Register the service worker after Firebase is initialized
    }
  };

  // Initialize and fetch token once the component mounts
  useEffect(() => {
    initializeAndFetchToken(); // Initialize Firebase, register service worker, and fetch token
  }, []);

  useEffect(() => {
    // Fetch the FCM token once everything is initialized
    if (isFirebaseInitialized && isServiceWorkerRegistered) {
      fetchToken();
    }
  }, [isFirebaseInitialized, isServiceWorkerRegistered]);

  return <div>{children}</div>;
};

export default PushNotification;
