import "@/styles/globals.css";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/redux/store"
import Head from "next/head";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


export default function App({ Component, pageProps }) {
  const googleMapApikey = process.env.NEXT_PUBLIC_APP_MAP_API
  return (
    <div>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapApikey}&libraries=places`}
          async
          defer
        />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Component {...pageProps} />
        </PersistGate>
      </Provider>
      <ToastContainer theme={"light"} key="toastContainer" bodyClassName={"toast-body"} className={"toastContainer"} toastClassName='toast-container-class' />
    </div>

  );
}
