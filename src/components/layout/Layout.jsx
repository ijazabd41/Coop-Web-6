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
import LangFile from "@/utils/en.json"
import { setAvailableLanguages, setSelectedLanguage } from "@/redux/slices/languageSlice";


const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Theme.theme);
  const setting = useSelector((state) => state.Setting);
  const city = useSelector((state) => state.City);
  const language = useSelector(state => state.Language.selectedLanguage)

  const [loading, setLoading] = useState(false);
  // const [showLocation, setShowLocation] = useState(false)

  useEffect(() => {
    document.documentElement.dir = language?.type
  }, [])

  useEffect(() => {
    fetchSetting();
    fetchPaymentSetting();
    fetchLanguage();
  }, [city]);
  const fetchLanguage = async () => {
    try {
      const response = await api.getSystemLanguages({ id: 0, isDefault: 0, systemType: 3 })
      if (response.status == 1) {
        if (response.data !== undefined) {
          dispatch(setAvailableLanguages({ data: response.data }))
        } else {
          const language = {
            "id": 15,
            "name": "English",
            "code": "en",
            "type": "LTR",
            "system_type": 3,
            "is_default": 1,
            "json_data": LangFile,
            "display_name": "English",
            "system_type_name": "Website"
          }
          dispatch(setSelectedLanguage({ data: language }))
        }
      }
    } catch (error) {
      console.log("Error", error)
    }
  }

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





  return (
    <section>
      <PushNotification>
        <Header />
        {children}
        <Footer />
        <ToastContainer
          theme={theme}
          key="toastContainer"
          bodyClassName={"toast-body"}
          toastClassName="toast-container-className"
        />
      </PushNotification>
      {/* <Location showLocation={showLocation} setShowLocation={setShowLocation} /> */}
    </section>
  );
};

export default Layout;
