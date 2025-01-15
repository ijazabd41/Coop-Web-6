import Link from 'next/link';
import React, { useState } from 'react';
import { FaUserCircle, FaShoppingCart, FaWallet, FaCog } from "react-icons/fa";
import { useRouter } from 'next/router';
import WalletBalanceModal from './wallet/WalletBalanceModal';
import { useSelector } from 'react-redux';
import { t } from '@/utils/translation';
import Image from 'next/image';
import LogoutModal from '../logoutmodal/LogoutModal';
import DeleteModal from '../deleteModal/DeleteModal';


const ProfileSidebar = ({ setSelectedTab, selectedTab }) => {
    const router = useRouter()
    const user = useSelector(state => state.User.user)
    const setting = useSelector(state => state?.Setting?.setting);

    const [addWalletModal, setAddWalletModal] = useState(false)
    const [showLogout, setShowLogout] = useState(false)
    const [showDelete, setShowDelete] = useState(false)


    const handleTabChange = (tabName) => {
        setSelectedTab(tabName)
    }

    const handleWalletBalanceModal = () => {
        setAddWalletModal(true)
    }


    const activeTab = router.pathname.split('/').pop();



    return (
        <div>
            <div className="cardBorder rounded-sm ">
                {/* Header Section */}
                <div className='buttonBackground'>
                    <div className="flex items-center p-4">
                        <Image src={user?.profile} alt='Profile' height={0} width={0} className='w-12 h-12 rounded-sm' />
                        <div className="ml-3">
                            <p className="text-base textColor">{t("hello")},</p>
                            <p className="text-xl  font-semibold textColor">{user?.name}</p>
                        </div>
                    </div>
                </div>
                <div className=''>
                    <div className=" ">
                        <h3 className="text-base font-semibold textColor flex items-center cardBorder p-4">
                            <FaUserCircle className="mr-2 textColor" size={20} /> Account Manage
                        </h3>
                        <ul>
                            <Link href={`/profile`}>
                                <li className={`p-4  cursor-pointer   ${activeTab == "profile" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor primaryColor' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("profile")}>
                                    <span className="font-medium">Edit Profile</span>
                                </li>
                            </Link>

                            <Link href={`/profile/address`}>
                                <li className={`p-4  cursor-pointer   ${activeTab == "address" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("address")}>
                                    Manage Address
                                </li>
                            </Link>

                        </ul>
                    </div>

                    {/* Orders & Wishlist Manage Section */}
                    <div className="">
                        <h3 className="text-base font-semibold textColor  flex items-center  p-4 cardBorder">
                            <FaShoppingCart className="mr-2 textColor" size={20} /> Orders & Wishlist
                            Manage
                        </h3>
                        <ul>
                            <Link href={`/profile/activeorders`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "activeorders" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("activeorders")}>
                                    Active Orders
                                </li>
                            </Link>

                            <Link href={`/profile/orderhistory`}>
                                <li className={`p-4  cursor-pointer  ${activeTab == "orderhistory" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("orderhistory")}>
                                    Order History
                                </li>
                            </Link>
                            <Link href={`/profile/wishlist`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "wishlist" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("wishlist")}>
                                    My Wishlist
                                </li>
                            </Link>

                        </ul>
                    </div>

                    {/* Payment Manage Section */}
                    <div className="">
                        <h3 className="text-base font-semibold textColor flex items-center  p-4 cardBorder">
                            <FaWallet className="mr-2 textColor" size={20} /> Payment Manage
                        </h3>
                        <ul>
                            <li className="flex justify-between items-center p-4 rounded  textColor" >
                                <span>eGrocer Wallet</span>
                                <span className="text-base text-orange-600 font-medium bg-[#EB9C001F] p-1 rounded-sm">{setting?.currency}{user?.balance}</span>
                            </li>
                            <li className={`p-4  cursor-pointer  textColor ${activeTab == "add-balance" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={handleWalletBalanceModal}>
                                Add Wallet Balance
                            </li>
                            <Link href={`/profile/wallethistory`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "wallethistory" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("wallethistory")}>
                                    Wallet History
                                </li>
                            </Link>

                            <Link href={`/profile/transaction`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "transaction" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("transaction")}>
                                    Transaction History
                                </li>
                            </Link>
                        </ul>
                    </div>

                    {/* Other Settings Section */}
                    <div>
                        <h3 className="text-base font-semibold textColor  flex items-center  p-4 cardBorder">
                            <FaCog className="mr-2 textColor" size={20} /> Other Settings
                        </h3>
                        <ul>
                            <Link href={`/profile/notifications`}>
                                <li className={`p-4  cursor-pointer  textColor ${activeTab == "notifications" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("notifications")}>
                                    Notification
                                </li>
                            </Link>
                            <li className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`} onClick={() => setShowLogout(true)}>
                                Logout
                            </li>
                            <li className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`} onClick={() => setShowDelete(true)}>
                                Delete Account
                            </li>
                        </ul>
                    </div>
                </div>
                <WalletBalanceModal addWalletModal={addWalletModal} setAddWalletModal={setAddWalletModal} />
                <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
                <DeleteModal showDelete={showDelete} setShowDelete={setShowDelete} />
            </div>
        </div>
    )
}

export default ProfileSidebar