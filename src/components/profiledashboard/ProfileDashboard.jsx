import React, { useState, useEffect } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import ProfileSidebar from "./ProfileSidebar";
import Profile from "./Profile";
import Address from "./Address";
import ActiveOrders from "./ActiveOrders";
import OrderHistory from "./OrderHistory";
import Wishlist from "./Wishlist";
import { useRouter } from "next/router";
import WalletHistory from "./WalletHistory";
import TransactionHistory from "./TransactionHistory";
import Notifications from "./Notifications";

const ProfileDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    const currentTab = router.pathname.split('/').pop();
    setSelectedTab(currentTab || 'profile');
    setLoading(false)
  }, [router.pathname]);

  const activeTab = router.pathname.split('/').pop();

  return (
    <section>
      <BreadCrumb />
      <div className="container px-2">
        <div className="grid grid-cols-12 gap-6 my-10">
          <div className="md:col-span-3 hidden md:block">
            <ProfileSidebar
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
          </div>

          <div className='col-span-12 md:col-span-9  '>
            {loading ? <p>Loading</p> : <>
              {activeTab == "profile" && <Profile />}
              {activeTab == "address" && <Address />}
              {activeTab == "activeorders" && <ActiveOrders />}
              {activeTab == "orderhistory" && <OrderHistory />}
              {activeTab == "wishlist" && <Wishlist />}
              {activeTab == "wallethistory" && <WalletHistory />}
              {activeTab == "transactions" && <TransactionHistory />}
              {activeTab == "notifications" && <Notifications selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
            </>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfileDashboard;
