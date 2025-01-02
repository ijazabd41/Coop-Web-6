import React, { PropsWithChildren, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { setPaymentSetting, setSetting } from "@/redux/slices/settingSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/api/apiRoutes";
import { ToastContainer } from "react-toastify";
import { setShop } from "@/redux/slices/shopSlice";
import Loader from "../loader/Loader";
import Location from "../locationmodal/Location";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import PushNotification from "../firebasenotification/PushNotification";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Theme.theme);
  const setting = useSelector((state) => state.Setting);
  const city = useSelector((state) => state.City);

  const [loading, setLoading] = useState(false);
  // const [showLocation, setShowLocation] = useState(false)

  // useEffect(() => {
  //     fetchCity();
  // }, [setting])

  useEffect(() => {
    fetchSetting();
    fetchPaymentSetting();
  }, [city]);

  const fetchSetting = async () => {
    setLoading(true);
    try {
      const res = await api.getSetting();
      dispatch(setSetting({ data: res?.data }));
      dispatch(
        setFavoriteProductIds({ data: res?.data?.favorite_product_ids })
      );
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const fetchPaymentSetting = async () => {
    setLoading(true);
    try {
      const res = await api.getPaymentSetting();
      dispatch(setPaymentSetting({ data: JSON.parse(atob(res.data)) }));
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  // const fetchCity = async () => {
  //     setLoading(true)
  //     try {
  //         if (setting?.setting?.default_city && city?.city == null) {
  //             const latitude = parseFloat(setting.setting.default_city?.latitude)
  //             const longitude = parseFloat(setting.setting.default_city?.longitude)
  //             const response = await api.getCity({ latitude: latitude, longitude: longitude })
  //             if (response.status === 1) {
  //                 dispatch(setCity({ data: response.data }));
  //                 setLoading(false)
  //             } else {
  //                 setLocModal(true);
  //                 setLoading(false)
  //             }
  //         } else if (setting?.setting && setting.setting?.default_city == null && city?.city == null) {
  //             setShowLocation(true);
  //             setLoading(false)
  //         }
  //     } catch (error) {
  //         setLoading(false)
  //         console.log("error", error)
  //     }
  // }

  return (
    <section>
      {
        <PushNotification>
          <Header />
          {children}
          <Footer />
          <ToastContainer
            theme={theme}
            key="toastContainer"
            bodyClassName={"toast-body"}
            toastClassName="toast-container-class"
          />
        </PushNotification>
      }
      {/* <Location showLocation={showLocation} setShowLocation={setShowLocation} /> */}
    </section>
  );
};

export default Layout;
