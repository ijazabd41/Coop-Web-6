import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { setPaymentSetting, setSetting } from "@/redux/slices/settingSlice";
import { setCity } from "@/redux/slices/citySlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/api/apiRoutes";
import { ToastContainer } from "react-toastify";
import Loader from "../loader/Loader";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import PushNotification from "../firebasenotification/PushNotification";
import LangFile from "@/utils/en.json";
import {
  setAvailableLanguages,
  setSelectedLanguage,
} from "@/redux/slices/languageSlice";
import { useRouter } from "next/router";
import MaintanceMode from "../error/MaintanceMode";
import {
  setCart,
  setCartSubTotal,
  setIsGuest,
} from "@/redux/slices/cartSlice";

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Theme.theme);
  const setting = useSelector((state) => state.Setting);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const user = useSelector((state) => state.User.user);

  const availableLanguages = useSelector((state) => state.Language.availableLanguages);
  const city = useSelector((state) => state.City);

  const [loading, setLoading] = useState(false);
  // const [showLocation, setShowLocation] = useState(false)

  useEffect(() => {
    document.documentElement.dir = language?.type;
  }, [language?.id]);

  useEffect(() => {
    fetchSetting();
    fetchPaymentSetting();
   
    fetchLanguage();
  
  }, []);

  useEffect(() => {
    if (!user?.jwtToken) return;

    dispatch(setIsGuest({ data: false }));

    const syncCart = async () => {
      try {
        const response = await api.getCart();
        if (response?.status === 1) {
          dispatch(setCart({ data: response }));
          dispatch(setCartSubTotal({ data: response?.sub_total ?? 0 }));
        }
      } catch (error) {
        console.log("cart sync error", error);
      }
    };

    syncCart();
  }, [user?.jwtToken, dispatch]);

  useEffect(() => {
  if (!router.isReady || !availableLanguages?.length) return;

  const queryLang = router.query.lang;

  if (!queryLang || queryLang === language?.code) return;

  const targetLang = availableLanguages.find((l) => l.code === queryLang);

  // Invalid lang code in URL → fall back to "en" (or the marked default)
  if (!targetLang) {
    const fallbackLang =
      availableLanguages.find((l) => l.code === "en") ||
      availableLanguages.find((l) => l.is_default == 1) ||
      availableLanguages[0];

    if (!fallbackLang || fallbackLang.code === language?.code) {
      // Already on the correct language, just fix the URL
      router.replace(
        { pathname: router.pathname, query: { ...router.query, lang: language?.code } },
        undefined,
        { shallow: true }
      );
      return;
    }

    api.getSystemLanguages({
      id: fallbackLang.id,
      isDefault: 0,
      systemType: 3,
    })
      .then((res) => {
        if (res.status == 1) {
          dispatch(setSelectedLanguage({ data: res.data }));
          document.documentElement.dir = res.data.type;
          // Update URL to show the actual fallback code
          router.replace(
            { pathname: router.pathname, query: { ...router.query, lang: res.data.code } },
            undefined,
            { shallow: true }
          );
        }
      })
      .catch((err) => console.log("lang fallback error", err));
    return;
  }

  api.getSystemLanguages({
    id: targetLang.id,
    isDefault: 0,
    systemType: 3,
  })
    .then((res) => {
      if (res.status == 1 && res.data?.code !== language?.code) {
        dispatch(setSelectedLanguage({ data: res.data }));
        document.documentElement.dir = res.data.type;
      }
    })
    .catch((err) => console.log("lang sync error", err));
}, [router.query.lang, router.isReady, availableLanguages]);


  const fetchLanguage = async () => {
    try {
      const response = await api.getSystemLanguages({
        id: 0,
        isDefault: 0,
        systemType: 3,
      });
      if (response.status == 1) {
        if (response.data !== undefined) {
          if (response?.data?.length == 1) {
            try {
              const langRes = await api.getSystemLanguages({
                id: response?.data?.[0]?.id,
                isDefault: 1,
                systemType: 3,
              });
              if (langRes.status == 1) {
                document.documentElement.dir = langRes?.data?.type;
                dispatch(setSelectedLanguage({ data: langRes?.data }));
              } else {
                const language = {
                  id: 15,
                  name: "English",
                  code: "en",
                  type: "LTR",
                  system_type: 3,
                  is_default: 1,
                  json_data: LangFile,
                  display_name: "English",
                  system_type_name: "Website",
                };
                dispatch(setSelectedLanguage({ data: language }));
              }
            } catch (error) {
              console.log("error");
            }
          } else if (language == null) {
            const langId = response?.data?.find(
              (lang) => lang?.is_default == 1
            )?.id;
            const langRes = await api.getSystemLanguages({
              id: langId,
              isDefault: 1,
              systemType: 3,
            });
            document.documentElement.dir = langRes?.data?.type;
            dispatch(setSelectedLanguage({ data: langRes?.data }));
          }
          dispatch(setAvailableLanguages({ data: response.data }));
        } else {
          const language = {
            id: 15,
            name: "English",
            code: "en",
            type: "LTR",
            system_type: 3,
            is_default: 1,
            json_data: LangFile,
            display_name: "English",
            system_type_name: "Website",
          };
          dispatch(setSelectedLanguage({ data: language }));
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
  if (!router.isReady) return;

  if (router.query.lang === language?.code) return;

  // If language exists but URL doesn't have it → add it
  if (language?.code && !router.query.lang) {
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, lang: language.code },
      },
      undefined,
      { shallow: true }
    );
  }
}, [language, router.isReady]);

  const fetchSetting = async () => {
    setLoading(true);
    try {
      const res = await api.getSetting();
      if (res?.status !== 1 || !res?.data) {
        return;
      }
      const setting = JSON.parse(atob(res.data));
      dispatch(setSetting({ data: setting }));
      dispatch(setFavoriteProductIds({ data: setting?.favorite_product_ids }));
      if (setting?.default_city && !city?.city) {
        dispatch(
          setCity({
            data: {
              city: setting.default_city.name,
              latitude: setting.default_city.latitude,
              longitude: setting.default_city.longitude,
            },
          })
        );
      }
      const brandPrimary =
        process.env.NEXT_PUBLIC_BRAND_PRIMARY || "#D61F26";
      const brandLight =
        process.env.NEXT_PUBLIC_BRAND_LIGHT || "#FFE8E9";
      document.documentElement.style.setProperty(
        "--primary-color",
        setting?.web_settings?.color || brandPrimary
      );
      if (setting?.favicon) {
        const link =
          document.querySelector("link[rel*='icon']") ||
          document.createElement("link");
        const oldLinks = document.querySelectorAll("link[rel*='icon']");
        oldLinks.forEach((el) => el.parentNode.removeChild(el));
        link.type = "image/x-icon";
        link.rel = "shortcut icon";
        link.href = setting.favicon;
        link.sizes = "16x16 32x32 64x64";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      document.documentElement.style.setProperty(
        "--light-primary-color",
        setting?.web_settings?.light_color || brandLight
      );
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentSetting = async () => {
    try {
      const res = await api.getPaymentSetting();
      if (res?.status === 1 && res?.data) {
        dispatch(setPaymentSetting({ data: JSON.parse(atob(res.data)) }));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    // Show loader on route change start
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    // Cleanup event listeners
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <section>
      {loading ? (
        <Loader screen="full" />
      ) : Number(setting?.setting?.web_settings?.website_mode) === 1 ? (
        <MaintanceMode
          message={setting?.setting?.web_settings?.website_mode_remark}
        />
      ) : (
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
      )}
      {/* <Location showLocation={showLocation} setShowLocation={setShowLocation} /> */}
    </section>
  );
};

export default Layout;
