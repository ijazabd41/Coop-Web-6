import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import WalletBalanceModal from "./wallet/WalletBalanceModal";
import { useSelector } from "react-redux";
import { t } from "@/utils/translation";
import Image from "next/image";
import LogoutModal from "../logoutmodal/LogoutModal";
import DeleteModal from "../deleteModal/DeleteModal";
import { BiCartAlt, BiCog, BiUserCircle, BiWallet } from "react-icons/bi";
import ReferAndEarnModal from "@/components/refer-and-earn/ReferAndEarnModal";
import LightImage from "@/assets/Vector.png";
import MoneyImage from "@/assets/bx-money.png";
import BikeImage from "@/assets/bike.png";
import { FaArrowRight } from "react-icons/fa";

const ProfileSidebar = ({ setSelectedTab, selectedTab }) => {
  const router = useRouter();
  const user = useSelector((state) => state.User.user);
  const authType = useSelector((state) => state.User.authType);
  const setting = useSelector((state) => state?.Setting?.setting);

  const [addWalletModal, setAddWalletModal] = useState(false);
  const [showReferAndEarn, setShowReferAndEarn] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleWalletBalanceModal = () => {
    setAddWalletModal(true);
  };

  const handleShowReferAndEarn = () => {
    setShowReferAndEarn(true);
  };

  const activeTab = router.pathname.split("/").pop();

  const slides = [
    {
      id: 1,
      text: t("egrocer_max"),
      image: (
        <div className="p-2 primaryBackColor rounded-full border border-white h-9 w-9 ">
          <Image
            src={LightImage}
            alt="light logo"
            className={`h-5 w-5 object-contain `}
            height={0}
            width={0}
          />
        </div>
      ),
      theme: "border-green-500 bg-[#55AE7B1F] text-green-800",
    },
    {
      id: 2,
      text: t("go_max_save_more"),
      image: (
        <div className="p-2 bg-[#0186D8] rounded-full border border-white h-9 w-9 ">
          <Image
            src={MoneyImage}
            alt="light logo"
            className={`h-5 w-5 object-contain `}
            height={0}
            width={0}
          />
        </div>
      ),
      theme: "border-blue-500 bg-[#0186D81F] text-blue-800",
    },
    {
      id: 3,
      text: t("free_delivery_desc"),
      image: (
        <div className="p-2 bg-[#DB9305] rounded-full border border-white h-9 w-9 ">
          <Image
            src={BikeImage}
            alt="light logo"
            className={`h-5 w-5 object-contain `}
            height={0}
            width={0}
          />
        </div>
      ),
      theme: "border-orange-500 bg-[#DB93051F] text-orange-800",
    },
  ];

  return (
    <div>
      <div className="cardBorder rounded-sm ">
        {/* Header Section */}
        <div className="backgroundColor flex flex-col p-6 gap-6">
          <div className="flex items-center  gap-6">
            <div className="h-28 w-28 rounded-full border-2 bodyBackgroundColor flex items-center justify-center ">
              <Image
                src={user?.profile}
                alt="Profile"
                width={80}
                height={80}
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
            <div className="w-1/2 ">
              <p className="text-base font-bold ">{t("hello")},</p>
              <p className="text-xl  font-bold textColor">
                {user?.name?.slice(0, 16)}
              </p>
            </div>
          </div>
          <div className="dashedBorder px-4"></div>
          <div className="flex gap-3 ">
            <div className="p-2 primaryBackColor rounded-full border border-white h-9 w-9 ">
              <Image
                src={LightImage}
                alt="light logo"
                className={`h-5 w-5 object-contain `}
                height={0}
                width={0}
              />
            </div>
            <div className="flex flex-col w-3/4 ">
              <h2 className="font-bold text-base">{t("egrocer_max")}</h2>
              <p className="text-sm leading-[17px] font-normal ">
                {t("egrocer_max_desc")}
              </p>
            </div>
          </div>
          <div className="flex justify-center ">
            <div
              className={`relative h-14 w-full max-w-sm overflow-hidden rounded border-[1.5px] transition-colors duration-500 ${slides[current].theme} rounded-md`}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 flex items-center justify-center font-semibold transition-all duration-500 ease-in-out `}
                  style={{
                    transform: `translateY(${(index - current) * 100}%)`,
                    opacity: index === current ? 1 : 0,
                  }}
                >
                  <div className="flex gap-2 items-center font-bold justify-between px-4 w-full">
                    <div className="flex gap-2 items-center">
                      {slide.image}
                      {slide.text}
                    </div>
                    <div>
                      <FaArrowRight />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="">
          <div className=" ">
            <h3 className="text-base font-semibold textColor flex items-center cardBorder p-4">
              <BiUserCircle className="mr-2 textColor" size={20} />{" "}
              {t("account_manage")}
            </h3>
            <ul>
              <Link href={`/profile`}>
                <li
                  className={`p-4  cursor-pointer   ${
                    activeTab == "profile"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor primaryColor"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("profile")}
                >
                  <span className="font-medium ml-12">{t("editProfile")}</span>
                </li>
              </Link>
              {authType == "email" ||
                (authType == "phone" && setting?.phone_auth_password == 1 && (
                  <Link href={`/profile/resetpassword`}>
                    <li
                      className={`p-4  cursor-pointer   ${
                        activeTab == "resetpassword"
                          ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor primaryColor"
                          : "hover:primaryBackColor hover:text-white"
                      }`}
                      onClick={() => handleTabChange("profile")}
                    >
                      <span className="font-medium ml-12">
                        {t("resetPassword")}
                      </span>
                    </li>
                  </Link>
                ))}

              <Link href={`/profile/address`}>
                <li
                  className={`p-4  cursor-pointer   ${
                    activeTab == "address"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("address")}
                >
                  <span className="ml-12">{t("manage_address")}</span>
                </li>
              </Link>
              <Link href={`/profile/egrocermax`}>
                <li
                  className={`p-4  cursor-pointer   ${
                    activeTab == "address"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("egrocermax")}
                >
                  <span className="ml-12">{t("egrocer_max_title")}</span>
                </li>
              </Link>
            </ul>
          </div>

          {/* Orders & Wishlist Manage Section */}
          <div className="">
            <h3 className="text-base font-semibold textColor  flex items-center  p-4 cardBorder">
              <BiCartAlt className="mr-2 textColor" size={20} />
              {`${t("orders")} & ${t("wishlist")} ${t("manage")}`}
            </h3>
            <ul>
              <Link href={`/profile/activeorders`}>
                <li
                  className={`p-4  cursor-pointer  textColor ${
                    activeTab == "activeorders"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("activeorders")}
                >
                  <span className="ml-12">{t("active_orders")}</span>
                </li>
              </Link>

              <Link href={`/profile/orderhistory`}>
                <li
                  className={`p-4  cursor-pointer  ${
                    activeTab == "orderhistory"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("orderhistory")}
                >
                  <span className="ml-12">{t("order_history")}</span>
                </li>
              </Link>
              <Link href={`/profile/wishlist`}>
                <li
                  className={`p-4  cursor-pointer  textColor ${
                    activeTab == "wishlist"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("wishlist")}
                >
                  <span className="ml-12">{t("my_wishlist")}</span>
                </li>
              </Link>
            </ul>
          </div>

          {/* Payment Manage Section */}
          <div className="">
            <h3 className="text-base font-semibold textColor flex items-center  p-4 cardBorder">
              <BiWallet className="mr-2 textColor" size={20} />{" "}
              {`${t("payment")} ${t("manage")}`}
            </h3>
            <ul>
              <li className="flex justify-between items-center p-4 rounded  textColor">
                <span className="ml-12">{t("walletBalance")}</span>
                <span className="text-base text-orange-600 font-medium  bg-[#EB9C001F] p-1 rounded-sm">
                  {setting?.currency}
                  {user?.balance}
                </span>
              </li>
              <li
                className={`p-4  cursor-pointer  textColor ${
                  activeTab == "add-balance"
                    ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                    : "hover:primaryBackColor hover:text-white"
                }`}
                onClick={handleWalletBalanceModal}
              >
                <span className="ml-12">{t("addWalletBalance")}</span>
              </li>
              <Link href={`/profile/wallethistory`}>
                <li
                  className={`p-4  cursor-pointer  textColor ${
                    activeTab == "wallethistory"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("wallethistory")}
                >
                  <span className="ml-12">{t("wallet_history")}</span>
                </li>
              </Link>

              <Link href={`/profile/transaction`}>
                <li
                  className={`p-4  cursor-pointer  textColor ${
                    activeTab == "transaction"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("transaction")}
                >
                  <span className="ml-12">{t("transaction_history")}</span>
                </li>
              </Link>
            </ul>
          </div>

          {/* Other Settings Section */}
          <div className="">
            <h3 className="text-base font-semibold textColor  flex items-center  p-4 cardBorder">
              <BiCog className="mr-2 textColor" size={20} />{" "}
              {`${t("address_type_other")} ${t("setting")}`}
            </h3>
            <ul>
              <Link href={`/profile/notifications`}>
                <li
                  className={`p-4  cursor-pointer  textColor ${
                    activeTab == "notifications"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("notifications")}
                >
                  <span className="ml-12">{t("notification")}</span>
                </li>
              </Link>
              <Link href={`/profile/requested-products`}>
                <li
                  className={`p-4  cursor-pointer  textColor ${
                    activeTab == "requested-products"
                      ? "bg-[#55AE7B14] border-l-[#55AE7B] border-l-4"
                      : "hover:primaryBackColor hover:text-white"
                  }`}
                  onClick={() => handleTabChange("requested-products")}
                >
                  <span className="ml-12">{t("requestedProducts")}</span>
                </li>
              </Link>
              <li
                className={`p-4  cursor-pointer  textColor hover:primaryBackColor hover:text-white`}
                onClick={() => handleShowReferAndEarn()}
              >
                <span className="ml-12">{t("referandearn")}</span>
              </li>
              <li
                className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`}
                onClick={() => setShowLogout(true)}
              >
                <span className="ml-12">{t("logout")}</span>
              </li>
              <li
                className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`}
                onClick={() => setShowDelete(true)}
              >
                <span className="ml-12">{t("delete_account")}</span>
              </li>
            </ul>
          </div>
        </div>
        <WalletBalanceModal
          addWalletModal={addWalletModal}
          setAddWalletModal={setAddWalletModal}
        />
        <ReferAndEarnModal
          showReferAndEarn={showReferAndEarn}
          setShowReferAndEarn={setShowReferAndEarn}
        />
        <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
        <DeleteModal showDelete={showDelete} setShowDelete={setShowDelete} />
      </div>
    </div>
  );
};

export default ProfileSidebar;
