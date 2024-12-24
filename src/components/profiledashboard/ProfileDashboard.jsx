import React, { useState, useEffect } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import ProfileSidebar from './ProfileSidebar'
import Profile from './Profile'
import Address from './Address'
import ActiveOrders from './ActiveOrders'
import OrderHistory from './OrderHistory'
import Wishlist from './Wishlist'
import { useRouter } from 'next/router'
import WalletHistory from './WalletHistory'
import TransactionHistory from './TransactionHistory'

const ProfileDashboard = () => {

    const [selectedTab, setSelectedTab] = useState('profile');
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const currentTab = router.pathname.split('/').pop();
        setSelectedTab(currentTab || 'profile');
        setLoading(false)
    }, [router.pathname]);

    return (
        <section>
            <BreadCrumb />
            <div className='container'>
                <div className='grid grid-cols-12 gap-6 my-10'>
                    <div className='col-span-3'>
                        <ProfileSidebar setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
                    </div>

                    <div className='col-span-9  '>
                        {loading ? <p>Loading</p> : <>
                            {selectedTab == "profile" && <Profile />}
                            {selectedTab == "address" && <Address />}
                            {selectedTab == "activeorders" && <ActiveOrders />}
                            {selectedTab == "orderhistory" && <OrderHistory />}
                            {selectedTab == "wishlist" && <Wishlist />}
                            {selectedTab == "wallethistory" && <WalletHistory />}
                            {selectedTab == "transactions" && <TransactionHistory />}
                        </>}

                    </div>
                </div>
            </div>
        </section>
    )
}

export default ProfileDashboard