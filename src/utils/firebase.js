import { useSelector } from "react-redux";
import Loader from "@/components/loader/Loader";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, onMessage } from "firebase/messaging";

const FirebaseData = () => {
  const setting = useSelector((state) => state.Setting);
  if (setting.setting === null) {
    return <Loader screen="full" />;
  }

  const {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  } = setting.setting?.firebase || {};

  const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
    measurementId,
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth(app);

  const messaging = getMessaging(app);

  //   console.log("messaging: ", messaging);

  try {
    onMessage(messaging, (payload) => {
      const data = payload?.data;
      new Notification(data?.title, {
        body: data?.message,
        icon: data?.image || setting?.setting?.web_settings?.web_logo,
      });
    });
  } catch (err) {
    console.log("Messaging Error:", err?.message);
  }

  return { auth, app, messaging };
};

export default FirebaseData;
