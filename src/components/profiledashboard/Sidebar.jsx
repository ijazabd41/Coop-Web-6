import Link from 'next/link';
import React from 'react';
import { FaUserCircle, FaShoppingCart, FaWallet, FaCog } from "react-icons/fa";
import { useRouter } from 'next/router';
const Sidebar = ({ setSelectedTab, selectedTab }) => {
    const router = useRouter()
    const handleTabChange = (tabName) => {
        setSelectedTab(tabName)
    }

    return (
        <div>
            <div className="cardBorder rounded-sm ">
                {/* Header Section */}
                <div className='buttonBackground'>
                    <div className="flex items-center p-4">
                        <div className="w-12 h-12 bg-[#D9D9D9]  rounded-sm flex items-center justify-center textColor text-xl">
                            <FaUserCircle size={30} />
                        </div>
                        <div className="ml-3">
                            <p className="text-base textColor">Hello,</p>
                            <p className="text-xl  font-semibold textColor">Divy Jani</p>
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
                                <li className={`p-4  cursor-pointer   ${selectedTab == "profile" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor primaryColor' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("profile")}>
                                    <span className="font-medium">Edit Profile</span>
                                </li>
                            </Link>

                            <Link href={`/profile/address`}>
                                <li className={`p-4  cursor-pointer   ${selectedTab == "address" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4 primaryColor' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("address")}>
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
                                <li className={`p-4  cursor-pointer  textColor ${selectedTab == "activeorders" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("activeorders")}>
                                    Active Orders
                                </li>
                            </Link>

                            <Link href={`/profile/orderhistory`}>
                                <li className={`p-4  cursor-pointer  ${selectedTab == "orderhistory" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("orderhistory")}>
                                    Order History
                                </li>
                            </Link>
                            <li className={`p-4  cursor-pointer  textColor ${selectedTab == "wishlist" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("wishlist")}>
                                My Wishlist
                            </li>
                        </ul>
                    </div>

                    {/* Payment Manage Section */}
                    <div className="">
                        <h3 className="text-base font-semibold textColor flex items-center  p-4 cardBorder">
                            <FaWallet className="mr-2 textColor" size={20} /> Payment Manage
                        </h3>
                        <ul>
                            <li className="flex justify-between items-center p-4 rounded hover:bg-gray-100 textColor" >
                                <span>eGrocer Wallet</span>
                                <span className="text-base text-orange-600 font-medium">$2630.00</span>
                            </li>
                            <li className={`p-4  cursor-pointer  textColor ${selectedTab == "add-balance" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("add-balance")}>
                                Add Wallet Balance
                            </li>
                            <li className={`p-4  cursor-pointer  textColor ${selectedTab == "wallet-history" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("wallet-history")}>
                                Wallet History
                            </li>
                            <li className={`p-4  cursor-pointer  textColor ${selectedTab == "transactions" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("transactions")}>
                                Transaction History
                            </li>
                        </ul>
                    </div>

                    {/* Other Settings Section */}
                    <div>
                        <h3 className="text-base font-semibold textColor  flex items-center  p-4 cardBorder">
                            <FaCog className="mr-2 textColor" size={20} /> Other Settings
                        </h3>
                        <ul>
                            <li className={`p-4  cursor-pointer  textColor ${selectedTab == "notification" ? 'bg-[#55AE7B14] border-l-[#55AE7B] border-l-4' : 'hover:primaryBackColor hover:text-white'}`} onClick={() => handleTabChange("notification")}>
                                Notification
                            </li>
                            <li className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`}>
                                Logout
                            </li>
                            <li className={`p-4 rounded cursor-pointer hover:primaryBackColor hover:text-white textColor`}>
                                Delete Account
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Sidebar