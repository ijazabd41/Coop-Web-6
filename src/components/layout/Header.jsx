'use client'
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import Image from 'next/image';
import Logo from "/public/egrocerLogo.png"

import { IoCartOutline, IoPersonOutline, IoLocationOutline, IoSunnyOutline } from 'react-icons/io5';
import { FaPhoneVolume } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import CartDrawer from '../cart/CartDrawer';
import Login from '../login/Login';

import { t } from "@/utils/translation"


const Header = () => {

    const [showCart, setShowCart] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false)
    const [showNewUser, setShowNewUser] = useState(false)

    const handleCartOpen = () => {
        setShowCart(true)
    }

    const handleLoginOpen = () => {
        setShowLogin(true)
    }

    return (
        <section className='border-b-2 pb-3'>
            <div className="w-full primaryBackColor top-header text-white lg:block md:block hidden">
                <div className="container flex justify-between items-center h-[40px]">
                    <div className="flex items-center">
                        <p>{t("follow_us")}</p>
                        <div className="flex">
                            <ul className="flex gap-2 px-[16px] py-[8px]">
                                <li className="border-r-[2px] p-2">
                                    <FaFacebookF size={20} />
                                </li>
                                <li className="border-r-[2px] p-2">
                                    <FaInstagram size={20} />
                                </li>
                                <li className="border-r-[2px] p-2">
                                    <FaYoutube size={20} />
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex gap-[8px]">
                        <Select>
                            <SelectTrigger className="w-[100px] border-none">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="w-[100px] bg-white">
                                <SelectItem value="light">{t("light")}</SelectItem>
                                <SelectItem value="dark">{t("dark")}</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-[100px] border-none">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="w-[100px] bg-white">
                                <SelectItem value="light">l</SelectItem>
                                <SelectItem value="dark">D</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className='center-header '>
                <div className='container flex justify-between items-center pb-[8px] md:py-[12px] lg:py-[12px] columns-3 border-b-2 lg:border-none md:border-none my-2'>
                    <div className='order-2 lg:order-1 '>
                        <Image src={Logo} alt='Logo' className='h-[38px] lg:h-[45px] w-[140px] lg:w-[170px]' />
                    </div>
                    <div className='hidden lg:flex order-2'>
                        <ul className='flex gap-6'>
                            <li>{t("home")}</li>
                            <li>{t("about_us")}</li>
                            <li>{t("faq")}</li>
                            <li>{t("contact_us")}</li>
                        </ul>
                    </div>
                    <div className='flex sm:order-1 md:order-1 lg:hidden'>
                        <RxHamburgerMenu size={21} />
                    </div>
                    <div className=' gap-4 order-3 hidden md:flex lg:flex '>
                        <div className='flex items-center gap-2 cursor-pointer' onClick={handleCartOpen}>
                            <span className='p-3 iconBackgroundColor rounded-full'><IoCartOutline size={24} className='iconsColor' /></span>
                            <div className='flex flex-col '>
                                <span className='text-sm'>{t("your_cart")}</span>
                                <span className='text-base font-bold'>$ 3800.00</span>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center cursor-pointer' onClick={handleLoginOpen}>
                            <span className='p-3 iconBackgroundColor rounded-full'><IoPersonOutline size={24} className='iconsColor' /></span>
                            <div className='flex '>
                                <span className='text-base font-bold'>{t("profile")}</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex lg:hidden md:hidden gap-2 order-3'>
                        <div ><IoSunnyOutline size={20} /></div>
                        <div onClick={handleCartOpen}><IoCartOutline size={20} /></div>
                    </div>
                </div>

            </div>
            <div className="bottom-header ">
                <div className="container mx-auto grid grid-cols-12 items-center justify-between">
                    {/* First column: col-3 equivalent */}
                    <div className="col-span-4 lg:col-span-3 flex gap-2 items-center">
                        <span className="p-3 iconBackgroundColor  rounded-full">
                            <IoLocationOutline size={24} className='iconsColor' />
                        </span>
                        <div className="flex flex-col">
                            <span className="text-sm ">{t("deliver_to")}</span>
                            <span className="block text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap w-40">
                                Bhuj, Gujarat, India
                            </span>

                        </div>
                    </div>

                    {/* Second column: col-6 equivalent */}
                    <div className="lg:col-span-6 md:col-span-8  items-center headerSearch hidden lg:flex md:flex rounded-[5px]  ml-[20px]">
                        <Select>
                            <SelectTrigger className="w-[152px] h-full buttonBackground border-none">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="w-[152px] h-full z-10 bg-white hidden md:block lg:block">
                                <SelectItem value="light">{t("light")}</SelectItem>
                                <SelectItem value="dark">{t("dark")}</SelectItem>
                            </SelectContent>
                        </Select>
                        <input
                            type="text"
                            placeholder="Search Here..."
                            className="flex-grow px-4 py-2 text-sm  rounded  focus:outline-none h-full shadow "
                        />
                        <button
                            className="p-[20px] col-span-4 h-full flex items-center rounded font-medium text-whiterounded  focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#29363f] text-white text-xl shadow"
                        >
                            Search
                        </button>
                    </div>

                    <div className="col-span-3 hidden order-3 justify-end lg:flex h-full">
                        <button className="p-[10px] w-44 flex items-center justify-center font-medium text-white  rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 primaryBackColor gap-2 text-xl">
                            <FaPhoneVolume size={18} /> 987654321
                        </button>
                    </div>
                </div>
            </div>
            <CartDrawer setShowCart={setShowCart} showCart={showCart} />
            <Login showLogin={showLogin} setShowLogin={setShowLogin} />
        </section>
    )
}

export default Header