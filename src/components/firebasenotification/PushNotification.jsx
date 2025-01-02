import { setFcmToken } from "@/redux/slices/userSlice";
import FirebaseData from "@/utils/firebase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const PushNotification = ({ children }) => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState("");
  const [token, setToken] = useState("");
  const [isMessagingSupported, setIsMessagingSupported] = useState(true);
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false); // Track Firebase init status
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] =
    useState(false);
  // Initialize Firebase app
  const initializeFirebase = async () => {
    try {
      if (!app) {
        throw new Error("Firebase app not initialized.");
      }
      
      setIsFirebaseInitialized(true);
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
        createStickyNote();
        return null;
      }
    } catch (err) {
      console.error("Error checking messaging support:", err);
      return null;
    }
  };
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
          getToken(messaging)
            .then((currentToken) => {
              if (currentToken) {
                setToken(currentToken);
                dispatch(setFcmToken({data:currentToken}));
              } else {
                setTokenFound(false);
                toast.error(t("permissionRequired"));
              }
            })
            .catch((err) => {
              console.error("Error retrieving token:", err);
              // If the error is "no active Service Worker", try to register the service worker again
              if (err.message.includes("no active Service Worker")) {
                registerServiceWorker();
              }
            });
        } else {
          setTokenFound(false);
          // toast.error('Permission is required for notifications.');
        }
      }
    } catch (err) {
      console.error("Error requesting notification permission:", err);
    }
  };

  const registerServiceWorker = () => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope
          );
          // After successful registration, try to fetch the token again
          fetchToken();
        })
        .catch((err) => {
          console.log("Service Worker registration failed: ", err);
        });
    }
  };
  const handleFetchToken = async () => {
    await fetchToken();
  };

  useEffect(() => {
    handleFetchToken();
  }, []);

  useEffect(() => {
    if (token !== "") {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log(
              "Service Worker registration successful with scope: ",
              registration.scope
            );
          })
          .catch((err) => {
            console.log("Service Worker registration failed: ", err);
          });
      }
    }
  }, [token]);

  return <div>{children}</div>;
};

export default PushNotification;
