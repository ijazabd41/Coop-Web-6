import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaMoon, FaRegUser, FaSun } from "react-icons/fa";
import * as api from "@/api/apiRoutes";
import {
  IoCartOutline,
  IoLocationOutline,
  IoHomeOutline,
  IoSearchOutline,
  IoLanguage,
} from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { FaPhoneVolume, FaXTwitter } from "react-icons/fa6";
import { BiCaretRight } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import { t } from "@/utils/translation";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
const Location = dynamic(() => import("../locationmodal/Location"), {
  ssr: false,
});
const Login = dynamic(() => import("../login/Login"), {
  ssr: false,
});
const CartDrawer = dynamic(() => import("../cart/CartDrawer"), {
  ssr: false,
  loading: () => null,
});
const LogoutModal = dynamic(() => import("../logoutmodal/LogoutModal"), {
  ssr: false,
});
const ProfileDrawer = dynamic(() => import("../profiledashboard/ProfileDrawer"), {
  ssr: false,
});
const MobileNavSidebar = dynamic(() => import("../mobile-nav-sidebar/MobileNavSidebar"), {
  ssr: false,
});
import {
  BiBell,
  BiBookmarkHeart,
  BiCartAlt,
  BiUserCircle,
  BiWallet,
  BiCart,
} from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { LuMapPin } from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/router";
import { setCity } from "@/redux/slices/citySlice";
import { setLocalTheme } from "@/redux/slices/themeSlice";
import { useTheme } from "next-themes";
// import LogoutModal from "../logoutmodal/LogoutModal";
// import ProfileDrawer from "../profiledashboard/ProfileDrawer";
import { clearCheckout } from "@/redux/slices/checkoutSlice";
import { setCartOpen } from "@/redux/slices/cartSlice";
import {
  setFilterSearch,
  setProductBySearch,
  setSearchedCategory,
} from "@/redux/slices/productFilterSlice";
import SearchComponent from "../search/SearchComponent";
import { useMediaQuery } from "react-responsive";
import { RiCloseFill } from "react-icons/ri";
import { setSelectedLanguage } from "@/redux/slices/languageSlice";
import Image from "next/image";
// import MobileNavSidebar from "../mobile-nav-sidebar/MobileNavSidebar";


import { CiSun } from "react-icons/ci";
import { FiMoon } from "react-icons/fi";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const themes = useSelector((state) => state.Theme);
  const cart = useSelector((state) => state.Cart);
  const setting = useSelector((state) => state.Setting);
  const user = useSelector((state) => state.User);
  const city = useSelector((state) => state.City);
  const filter = useSelector((state) => state.ProductFilter);
  const language = useSelector((state) => state.Language);
  const fcmToken = useSelector((state) => state.User?.fcm_token);

  // Device Width Checking
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });

  const isCartOpenRedux = useSelector((state) => state.Cart.isCartOpen);
  const showCart = isCartOpenRedux && router.pathname !== "/checkout" && router.pathname !== "/cart";
  const setShowCart = (val) => {
    dispatch(setCartOpen({ data: val }));
  };
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [mobileActiveKey, setMobileActiveKey] = useState(1);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [showProfile, setShowProfile] = useState(false);

  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchCatId, setSearchCatId] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isSuggLoading, setIsSuggLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (router?.pathname !== "/products") {
      dispatch(setFilterSearch({ data: "" }));
    }
  }, []);

  useEffect(() => {
    if (router?.pathname != "/checkout") {
      dispatch(clearCheckout());
    }
  }, [router]);

  useEffect(() => {
    // if mobile screen is dragged to desktop screen close the mobile search
    if (isMobile === false && mobileSearch === true) {
      setMobileSearch(false);
    }
  }, [isMobile]);
  useEffect(() => {
    fetchCity();
  }, [setting]);
  useEffect(() => {
    if (router.pathname.includes("/profile")) {
      setMobileActiveKey(3);
    }
  }, [router.pathname]);

  const handleChangeTheme = (theme) => {
    setTheme(theme);
    dispatch(setLocalTheme({ data: theme }));
  };

  const handleLanguageChange = async (language) => {
    if (language?.code === router.query.lang) return;
    try {
      const response = await api.getSystemLanguages({
        id: language?.id,
        isDefault: 0,
        systemType: 3,
      });
      if (response.status == 1) {
        dispatch(setSelectedLanguage({ data: response?.data }));
        // document.documentElement.dir = response?.data?.type;

        // Keep URL in sync when language is changed via dropdown
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query, lang: response?.data?.code },
          },
          undefined,
          { shallow: true }
        );

        await api.updateFcmToken({
          langaugeId: response?.data?.admin_lang_id_for_fcm,
          fcmToken,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchCity = async () => {
    try {
      if (setting?.setting?.default_city && city?.city == null) {
        const latitude = parseFloat(setting.setting.default_city?.latitude);
        const longitude = parseFloat(setting.setting.default_city?.longitude);
        const response = await api.getCity({
          latitude: latitude,
          longitude: longitude,
        });
        if (response.status === 1) {
          dispatch(setCity({ data: response.data }));
        } else {
          setShowLocation(true);
        }
      } else if (
        setting?.setting &&
        setting.setting?.default_city == null &&
        city?.city == null
      ) {
        setShowLocation(true);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCartOpen = () => {
    if (router.pathname == "/checkout") {
      router.push("/cart");
    } else {
      setShowCart(true);
    }
  };

  const handleLoginOpen = () => {
    setShowLogin(true);
  };

  const handleOpenLocation = () => {
    setShowLocation(true);
  };

  const handleHomeClick = () => {
    setMobileActiveKey(1);
    router.push("/");
  };

  const handleProfileClick = () => {
    setMobileActiveKey(3);
    if (user?.jwtToken && user?.jwtToken !== "undefined" && user?.user) {
      setShowProfile(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleSearchCategory = (value) => {
    setSearchCatId(value);
    dispatch(setSearchedCategory({ data: value }));
  };

  const handleSearchData = async (searchValue) => {
    setIsSuggLoading(true);
    try {
      const response = await api.getProductByFilter({
        latitude: city?.city?.latitude,
        longitude: city?.city?.longitude,
        filters: {
          search: searchValue,
          category_id: filter?.searchedCategory,
        },
      });
      dispatch(setProductBySearch({ data: response?.data }));
      setIsSuggLoading(false);
    } catch (error) {
      console.log("Error", error?.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      dispatch(setProductBySearch({ data: [] }));
      dispatch(setFilterSearch({ data: "" }));
      clearTimeout(typingTimeout);
      return;
    }
    setIsSuggLoading(true);
    dispatch(setFilterSearch({ data: e.target.value }));
    dispatch(setSearchedCategory({ data: searchCatId }));
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      handleSearchData(e.target.value);
    }, 2000);
    setTypingTimeout(timeout);
  };

  const handleMobileSearch = () => {
    setMobileSearch(!mobileSearch);
  };

  const handleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  return (
    <>
      <section className="border-b-2">
        <div className="w-full primaryBackColor top-header text-white  md:block hidden">
          <div className="container  flex justify-between items-center h-[40px] px-2">
            <div className="w-[50%]">
              {setting?.setting?.social_media?.length > 0 && (
                <div className="flex items-center whitespace-nowrap">
                  <p>{t("follow_us")}</p>
                  <div className="flex">
                    <ul className="flex gap-0 px-[16px] py-[8px]">
                      {setting?.setting?.social_media &&
                        setting?.setting?.social_media?.map((social, index) => {
                          return (
                            <Link
                              key={social?.id}
                              href={social?.link || "#"}
                              target="_blank"
                            >
                              <li className="border-r-[2px]  p-3 border-white py-[2px]">
                                {social?.icon
                                  .toLowerCase()
                                  .includes("wechat") ? (
                                  // Special handling for WeChat icon
                                  <i className="fab fa-weixin"></i>
                                ) : social?.icon
                                    .toLowerCase()
                                    .includes("twitter") ? (
                                  // Special handling for TikTok icon
                                  <FaXTwitter className={`${social?.icon}`} />
                                ) : (
                                  <i className={`${social?.icon}`}></i>
                                )}
                              </li>
                            </Link>
                          );
                        })}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-[8px] flex-last">
              <DropdownMenu>
                <DropdownMenuTrigger className="w-[100px] border-none flex items-center gap-2 justify-center">
                  {themes?.theme == "light" ? <FaSun /> : <FaMoon />}
                  {t(themes?.theme)}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[100px] ">
                  <DropdownMenuItem
                    onSelect={() => handleChangeTheme("light")}
                    className="flex gap-2"
                  >
                    <FaSun />
                    {t("light")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleChangeTheme("dark")}
                    className="flex gap-2"
                  >
                    <FaMoon />
                    {t("dark")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                {language?.availableLanguages?.length > 1 ? (
                  <DropdownMenuTrigger className="w-[100px] border-none flex items-center gap-2 justify-center">
                    <IoLanguage />{" "}
                    {language?.selectedLanguage
                      ? language?.selectedLanguage?.name
                      : "English"}
                  </DropdownMenuTrigger>
                ) : (
                  <button className="w-[100px] border-none flex items-center gap-2 justify-center">
                    <IoLanguage />{" "}
                    {language?.selectedLanguage
                      ? language?.selectedLanguage?.name
                      : "English"}
                  </button>
                )}

                <DropdownMenuContent className="w-[100px] ">
                  {language?.availableLanguages &&
                    language?.availableLanguages?.map((language) => {
                      return (
                        <DropdownMenuItem
                          onSelect={() => handleLanguageChange(language)}
                          key={language?.id}
                          className="flex gap-2"
                        >
                          {language?.name}
                        </DropdownMenuItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="headerBackgroundColor pb-0 md:pb-3 relative">
          <div className="center-header headerBackgroundColor container">
            <div className="px-2 flex justify-between items-center pb-[8px] md:py-[12px] lg:py-4 border-b-2 md:border-none py-2 w-full">
              <div className="flex items-center order-2 lg:order-1">
                <div className="relative h-[50px] lg:h-[65px] w-[130px] lg:w-[160px] flex items-center flex-shrink-0 mr-0 lg:mr-4 xl:mr-6">
                  <Link href={"/"} className="relative block w-full h-full flex items-center">
                    {setting?.setting?.web_settings?.web_logo && (
                      <Image
                        src={setting?.setting?.web_settings?.web_logo}
                        alt="Logo"
                        fill
                        priority={true}
                        fetchpriority="high"
                        loading="eager"
                        className="object-contain object-left"
                      />
                    )}
                  </Link>
                </div>
                <div className="hidden lg:flex items-center gap-3 flex-shrink-0 mr-0 lg:mr-6 xl:mr-10"
                    onClick={handleOpenLocation}
                  >
                    <span className="p-3 iconBackgroundColor rounded-full flex items-center justify-center h-[48px] w-[48px]">
                      <IoLocationOutline size={24} className="iconsColor" />
                    </span>
                    <div className="flex flex-col justify-center">
                      <span className="text-sm shortDescriptionText leading-none mb-1">
                        {t("deliver_to")}
                      </span>
                      <span className="block text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap truncate max-w-[200px] leading-none">
                        <>
                          {city.status === "fulfill" ? (
                            city?.city?.formatted_address || city?.city?.city || city?.city?.name || t("select_location") || "Select Location"
                          ) : (
                            <div className="d-flex justify-content-center">
                              <div className="spinner-border" role="status">
                                <span className="visually-hidden">
                                  {t("loading")}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      </span>
                    </div>
                </div>
                <div className="hidden lg:flex items-center flex-shrink-0">
                  <ul className="flex gap-6 xl:gap-8 items-center">
                    <Link
                      href={"/"}
                      className={router.pathname === "/" ? "primaryColor" : ""}
                    >
                      <li>{t("home")}</li>
                    </Link>
                    <Link
                      href={"/about-us"}
                      className={
                        router.pathname === "/about-us" ? "primaryColor" : ""
                      }
                    >
                      <li>{t("about_us")}</li>
                    </Link>
                    <Link
                      href={"/faqs"}
                      className={
                        router.pathname === "/faqs" ? "primaryColor" : ""
                      }
                    >
                      <li> {t("faq")}</li>
                    </Link>
                    <Link
                      href={"/contact-us"}
                      className={
                        router.pathname === "/contact-us" ? "primaryColor" : ""
                      }
                    >
                      <li>{t("contact_us")}</li>
                    </Link>
                    <Link
                      href={"/blogs"}
                      className={
                        router.pathname === "/blogs" ? "primaryColor" : ""
                      }
                    >
                      <li>{t("blogs")}</li>
                    </Link>
                  </ul>
                </div>
              </div>
              <div className="flex sm:order-1 lg:hidden hover:cursor-pointer flex-shrink-0">
                <RxHamburgerMenu size={21} onClick={handleMobileNav} />
              </div>
              <div className="gap-6 order-4 hidden lg:flex items-center flex-shrink-0">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={handleCartOpen}
                >
                  {/* <span className='p-3 iconBackgroundColor rounded-full '><IoCartOutline size={24} className='iconsColor' /></span> */}
                  <span className="p-3 iconBackgroundColor rounded-full relative flex items-center justify-center h-[48px] w-[48px]">
                    <BiCart size={24} className="iconsColor" />
                    {cart.isGuest == true ? (
                      <p
                        className={
                          cart?.guestCart?.length != 0
                            ? "flex absolute top-[-7px] right-0  bodyTextColor textBackground rounded-full h-[20px] w-[20px] items-center justify-center text-center font-bold text-sm"
                            : "none"
                        }
                      >
                        {" "}
                        {cart?.guestCart?.length != 0
                          ? cart?.guestCart?.length
                          : null}
                      </p>
                    ) : (
                      <p
                        className={
                          cart?.cartProducts?.length != 0
                            ? "flex absolute bodyTextColor top-[-7px] right-0 textBackground rounded-full text-center h-5 w-5 items-center justify-center p-1 font-bold text-sm"
                            : "none"
                        }
                      >
                        {" "}
                        {cart?.cartProducts?.length != 0
                          ? cart?.cartProducts?.length
                          : null}
                      </p>
                    )}
                  </span>
                  <div className="flex flex-col justify-center">
                    <span className="text-sm leading-none mb-1 text-gray-500">{t("your_cart")}</span>
                    <span className="text-base font-bold leading-none">
                      {setting.setting && setting.setting.currency}
                      {cart.isGuest == true
                        ? cart?.guestCartTotal?.toFixed(
                            setting?.setting?.decimal_point
                              ? setting?.setting?.decimal_point
                              : 0,
                          )
                        : cart?.cartSubTotal?.toFixed(
                            setting?.setting?.decimal_point
                              ? setting?.setting?.decimal_point
                              : 0,
                          )}
                    </span>
                  </div>
                </div>
                {(user?.jwtToken && user?.jwtToken !== "undefined" && user?.user) ? (
                  <div className="flex items-center cursor-pointer">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center border-none outline-none gap-3 p-0 shadow-none text-left">
                        <span className="p-3 iconBackgroundColor rounded-full flex items-center justify-center h-[48px] w-[48px]">
                          <LuUser size={24} className="iconsColor" />
                        </span>
                        <div className="flex flex-col justify-center">
                          <span className="text-base font-bold leading-none">{t("profile")}</span>
                        </div>
                      </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Link href={"/profile"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiUserCircle size={22} />
                                {t("editProfile")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/activeorders"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2  text-base font-semibold bg-transparent">
                                <BiCartAlt size={22} />
                                {t("orders")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/wishlist"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiBookmarkHeart size={22} />
                                {t("wishlist")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/notifications"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiBell size={22} />
                                {t("notification")}
                              </span>
                            </DropdownMenuItem>
                          </Link>

                          <Link href={"/profile/address"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <IoLocationOutline size={22} />
                                {t("myAddress")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <Link href={"/profile/wallethistory"}>
                            <DropdownMenuItem className="items-center flex justify-start h-full">
                              <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                <BiWallet size={22} />
                                {t("walletBalance")}
                              </span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="items-center flex justify-start h-full">
                            <span
                              className="flex p-2 gap-2 text-base font-semibold bg-transparent"
                              onClick={() => setShowLogout(true)}
                            >
                              <RiLogoutCircleRLine size={20} />
                              {t("logout")}
                            </span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
                ) : (
                  <div
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={handleLoginOpen}
                  >
                    <span className="p-3 iconBackgroundColor rounded-full flex items-center justify-center h-[48px] w-[48px]">
                      <LuUser size={24} className="iconsColor" />
                    </span>
                    <div className="flex flex-col justify-center">
                      <span className="text-base font-bold leading-none">{t("login")}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex lg:hidden gap-4 order-5 items-center flex-shrink-0">
                <div>
                  {themes?.theme == "light" ? (
                    <CiSun
                      onClick={() => handleChangeTheme("dark")}
                      size={24}
                    />
                  ) : (
                    <FiMoon
                      onClick={() => handleChangeTheme("light")}
                      size={24}
                    />
                  )}
                </div>
                <div onClick={handleCartOpen} className="relative flex items-center">
                  <IoCartOutline size={24} />{" "}
                  {cart.isGuest == true ? (
                    <p
                      className={
                        cart?.guestCart?.length != 0
                          ? "flex absolute  bottom-4 left-4  bodyTextColor textBackground rounded-full h-[18px] w-[18px] items-center justify-center text-center font-semibold text-xs"
                          : "none"
                      }
                    >
                      {" "}
                      {cart?.guestCart?.length != 0
                        ? cart?.guestCart?.length
                        : null}
                    </p>
                  ) : (
                    <p
                      className={
                        cart?.cartProducts?.length != 0
                          ? "flex absolute bodyTextColor bottom-4 left-4   textBackground rounded-full text-center h-4 w-4 items-center justify-center p-1 font-bold text-sm"
                          : "none"
                      }
                    >
                      {" "}
                      {cart?.cartProducts?.length != 0
                        ? cart?.cartProducts?.length
                        : null}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-header ">
            <div className="container mx-auto flex md:grid md:grid-cols-12 md:items-center justify-between mt-2 mb-2 md:mb-4 px-2 ">
              {/* Mobile-only location block */}
              <div
                className="md:hidden flex gap-2 items-center cursor-pointer"
                onClick={handleOpenLocation}
              >
                <span className="block">
                  <LuMapPin size={24} />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm shortDescriptionText">
                    {t("deliver_to")}
                  </span>
                  <span className="block text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap truncate max-w-[252px]">
                    <>
                      {city.status === "fulfill" ? (
                        city?.city?.formatted_address || city?.city?.city || city?.city?.name || t("select_location") || "Select Location"
                      ) : (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="visually-hidden">
                              {t("loading")}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  </span>
                </div>
              </div>
              <div className=" md:hidden flex items-center">
                <BiCaretRight size={18} />
              </div>
              <div className={`hidden md:block md:col-span-12 ${setting?.setting?.support_number ? "lg:col-span-9" : "lg:col-span-12"}`}>
                <SearchComponent
                  isSuggLoading={isSuggLoading}
                  isMobile={isMobile}
                  handleSearchCategory={handleSearchCategory}
                  handleSearch={handleSearch}
                />
              </div>
              {setting?.setting?.support_number && (
                <div className="col-span-3 hidden order-3 justify-end lg:flex  h-full">
                  <Link
                    href={`tel:${setting?.setting?.support_number}`}
                    className="p-[10px]   flex items-center justify-center font-medium text-white  rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 primaryBackColor gap-2 text-xl"
                  >
                    <FaPhoneVolume size={18} />{" "}
                    {setting?.setting?.support_number}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        <Sheet open={mobileSearch} onOpenChange={setMobileSearch}>
          <SheetContent
            className="p-0 w-full sm:w-[900px]"
            side={language?.selectedLanguage?.type == "RTL" ? "left" : "right"}
          >
            <SheetHeader>
              <SheetTitle className="flex justify-between px-4 py-2 items-center">
                {t("search")}
                <SheetTrigger className="focus:outline-none closeButtonBg rounded-full p-[8px] gap-[4px] cursor-pointer">
                  <RiCloseFill size={22} />
                </SheetTrigger>
              </SheetTitle>
              <SheetDescription>
                <SearchComponent
                  isSuggLoading={isSuggLoading}
                  isMobile={isMobile}
                  mobileSearch={mobileSearch}
                  setMobileSearch={setMobileSearch}
                  handleSearch={handleSearch}
                  handleSearchCategory={handleSearchCategory}
                />
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
        <MobileNavSidebar
          open={mobileNav}
          setOpen={setMobileNav}
          handleLanguageChange={handleLanguageChange}
        />
        <CartDrawer
          showCart={showCart}
          setShowCart={setShowCart}
          setMobileActiveKey={setMobileActiveKey}
        />
        <Login
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          setMobileActiveKey={setMobileActiveKey}
        />
        {showLocation && (
          <Location
            showLocation={showLocation}
            setShowLocation={setShowLocation}
          />
        )}
        <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
      </section>
      <section className="fixed bottom-0 left-0 w-full z-50 md:hidden backgroundColor pt-3">
        <div className="container flex items-center justify-center px-2 ">
          <div className="flex  justify-between gap-16">
            <div
              className={`flex flex-col items-center gap-1`}
              onClick={handleHomeClick}
            >
              <IoHomeOutline
                size={24}
                className={`h-10 w-10 ${
                  mobileActiveKey == 1
                    ? "primaryBackColor text-white  "
                    : "primaryTintBg primaryColor "
                }p-2 rounded-full`}
              />
              <span className="text-sm">{t("home")}</span>
            </div>

            <div
              className={`flex flex-col items-center gap-1`}
              onClick={handleMobileSearch}
            >
              <IoSearchOutline
                size={24}
                className={`h-10 w-10 ${
                  mobileActiveKey == 2
                    ? "primaryBackColor text-white "
                    : "primaryTintBg primaryColor "
                } p-2 rounded-full`}
              />
              <span className="text-sm">{t("search")}</span>
            </div>

            <div
              className={`flex flex-col items-center gap-1`}
              onClick={handleProfileClick}
            >
              <FaRegUser
                size={24}
                className={`h-10 w-10 ${
                  mobileActiveKey == 3
                    ? "primaryBackColor text-white "
                    : "primaryTintBg primaryColor "
                } p-2 rounded-full`}
              />
              <span className="text-sm">
                {(user?.jwtToken && user?.jwtToken !== "undefined" && user?.user) ? t("profile") : t("login")}
              </span>
            </div>
          </div>
        </div>
      </section>
      <ProfileDrawer
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
    </>
  );
};

export default Header;
