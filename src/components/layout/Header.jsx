'use client'
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaFacebookF, FaInstagram, FaMoon, FaRegUser, FaSun, FaYoutube } from "react-icons/fa";
import Image from 'next/image';
import * as api from "@/api/apiRoutes"
import { setSetting } from '@/redux/slices/settingSlice'
import { IoCartOutline, IoPersonOutline, IoLocationOutline, IoSunnyOutline, IoHomeOutline, IoSearchOutline } from 'react-icons/io5';
import { FaPhoneVolume } from "react-icons/fa6";
import { RxHamburgerMenu } from "react-icons/rx";
import CartDrawer from '../cart/CartDrawer';
import Login from '../login/Login';
import Register from '../register/Register';
import { t } from "@/utils/translation"
import NewUserModal from '../newusermodal/NewUserModal';
import { useDispatch, useSelector } from 'react-redux';
import Location from "@/components/locationmodal/Location"
import { BiBell, BiBookmarkHeart, BiCartAlt, BiMoneyWithdraw, BiUserCircle, BiWallet } from 'react-icons/bi';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setCity } from '@/redux/slices/citySlice';
import { setLocalTheme } from '@/redux/slices/themeSlice';
import { useTheme } from 'next-themes'
import LogoutModal from '../logoutmodal/LogoutModal';
import ProfileDrawer from '../profiledashboard/ProfileDrawer';
import { clearCheckout } from '@/redux/slices/checkoutSlice';
import { setFilterCategory, setFilterSearch, setSearchedCategory, setSelectedCategories } from '@/redux/slices/productFilterSlice';
import SearchProductCard from '../cards/SearchProductCard';


const Header = () => {
    const { theme, setTheme } = useTheme()
    const dispatch = useDispatch();
    const router = useRouter();
    const themes = useSelector(state => state.Theme)
    const cart = useSelector(state => state.Cart)
    const setting = useSelector(state => state.Setting);
    const user = useSelector(state => state.User);
    const city = useSelector(state => state.City)
    const categories = useSelector(state => state.Shop.shop);
    const filter = useSelector(state => state.ProductFilter)
    // console.log(categories.categories)
    const [showCart, setShowCart] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showLogout, setShowLogout] = useState(false)
    const [mobileActiveKey, setMobileActiveKey] = useState(1)
    const [selectedTab, setSelectedTab] = useState("profile")
    const [showProfile, setShowProfile] = useState(false)

    const [showLocation, setShowLocation] = useState(false)
    const [loading, setLoading] = useState(false)

    const [searchCatId, setSearchCatId] = useState(null);

    useEffect(() => {
        if (router?.pathname != "/checkout") {
            dispatch(clearCheckout())
        }
    }, [router])

    useEffect(() => {
        fetchCity();
    }, [setting])

    useEffect(() => {
        if (router.pathname.includes("/profile")) {
            setMobileActiveKey(3)
        }
    }, [router.pathname])

    const handleChangeTheme = (theme) => {
        setTheme(theme)
        dispatch(setLocalTheme({ data: theme }));
    };

    const fetchCity = async () => {
        try {
            if (setting?.setting?.default_city && city?.city == null) {
                const latitude = parseFloat(setting.setting.default_city?.latitude)
                const longitude = parseFloat(setting.setting.default_city?.longitude)
                const response = await api.getCity({ latitude: latitude, longitude: longitude })
                if (response.status === 1) {
                    dispatch(setCity({ data: response.data }));
                } else {
                    setLocModal(true);
                }
            } else if (setting?.setting && setting.setting?.default_city == null && city?.city == null) {
                setShowLocation(true);
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleCartOpen = () => {
        setShowCart(true)
    }

    const handleLoginOpen = () => {
        setShowLogin(true)
    }

    const handleOpenLocation = () => {
        setShowLocation(true)
    }

    const handleHomeClick = () => {
        setMobileActiveKey(1)
        router.push("/")
    }

    const handleSearchClick = () => {
        setMobileActiveKey(2)
    }

    const handleProfileClick = () => {
        setMobileActiveKey(3)
        if (user?.jwtToken) {
            setShowProfile(true)
        } else {
            setShowLogin(true)
        }
    }


    const [searchTerm, setSearchTerm] = useState("")
    const handleSearchCategory = (value) => {
        const parsedValue = parseInt(value);
        if (!isNaN(parsedValue)) {
            setSearchCatId(parsedValue)
            dispatch(setSearchedCategory({ data: String(parsedValue) }))
        } else {
            dispatch(setSearchedCategory({ data: "" }))
            setSearchCatId(null)
        }
    }

    const handleSearchTerm = (e) => setSearchTerm(e.target.value);

    useEffect(() => {
        if (searchTerm === "") {
            return;
        }
        const timeoutId = setTimeout(() => {
            dispatch(setFilterSearch({ data: searchTerm }))
            fetchSearchData();
        }, 1000)

        return () => {
            clearTimeout(timeoutId);
        }
    }, [searchTerm])

    const fetchSearchData = async () => {
        try {
            const response = await api.getProductByFilter({
                latitude: city?.city?.latitude,
                longitude: city?.city?.longitude,
                filters: {
                    category_id: searchCatId,
                    search: searchTerm
                }
            });
            console.log(response.data);
        } catch (error) {
            console.log("Error:", error);
        }
    }




    return (
        <>
            <section className='border-b-2 '>
                <div className="w-full primaryBackColor top-header text-white  md:block hidden">
                    <div className="container  flex justify-between items-center h-[40px]">
                        <div className="flex items-center">
                            <p>{t("follow_us")}</p>
                            <div className="flex">
                                <ul className="flex gap-2 px-[16px] py-[8px]">
                                    <li className="border-r-[2px] border-white p-2">
                                        <FaFacebookF size={20} />
                                    </li>
                                    <li className="border-r-[2px] p-2 border-white">
                                        <FaInstagram size={20} />
                                    </li>
                                    <li className="border-r-[2px] p-2 border-white">
                                        <FaYoutube size={20} />
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex gap-[8px]">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-[100px] border-none flex items-center gap-2 justify-center">
                                    {themes?.theme == "light" ? <FaSun /> : <FaMoon />}
                                    {themes?.theme}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[100px] ">
                                    <DropdownMenuItem
                                        onSelect={() => handleChangeTheme('light')}
                                        className="flex gap-2"
                                    >
                                        <FaSun />
                                        {t("light")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onSelect={() => handleChangeTheme('dark')}
                                        className="flex gap-2"
                                    >
                                        <FaMoon />
                                        {t("dark")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Select>
                                <SelectTrigger className="w-[100px] border-none">
                                    <SelectValue placeholder="Theme" />
                                </SelectTrigger>
                                <SelectContent className="w-[100px] ">
                                    <SelectItem value="light">l</SelectItem>
                                    <SelectItem value="dark">D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className='headerBackgroundColor pb-3'>
                    <div className='center-header headerBackgroundColor'>
                        <div className='container  px-2 flex justify-between items-center pb-[8px] md:py-[12px] lg:py-4 columns-3 border-b-2  md:border-none py-2'>
                            <div className=' aspect-square relative order-2 lg:order-1 h-[38px] lg:h-[45px] w-[140px] lg:w-[170px]'>
                                <Link href={"/"}><Image src={setting?.setting?.web_settings?.web_logo} alt='Logo' width={0} height={0} className='h-full lg:full w-full lg:w-full object-contain' /></Link>
                            </div>
                            <div className='hidden lg:flex order-2'>
                                <ul className='flex gap-6'>
                                    <Link href={"/"} className={router.pathname === '/' ? 'primaryColor' : ''}>
                                        <li>{t("home")}</li>
                                    </Link>
                                    <Link href={"/about-us"} className={router.pathname === '/about-us' ? 'primaryColor' : ''}>
                                        <li>{t("about_us")}</li>
                                    </Link>
                                    <Link href={"/faqs"} className={router.pathname === '/faqs' ? 'primaryColor' : ''}>
                                        <li> {t("faq")}</li>
                                    </Link>
                                    <Link href={"/contact-us"} className={router.pathname === '/contact-us' ? 'primaryColor' : ''}>
                                        <li>{t("contact_us")}</li>
                                    </Link>
                                </ul>
                            </div>
                            <div className='flex sm:order-1 md:order-1 lg:hidden'>
                                <RxHamburgerMenu size={21} />
                            </div>
                            <div className=' gap-4 order-3 hidden md:flex lg:flex '>
                                <div className='flex items-center gap-2 cursor-pointer' onClick={handleCartOpen}>
                                    {/* <span className='p-3 iconBackgroundColor rounded-full '><IoCartOutline size={24} className='iconsColor' /></span> */}
                                    <span className='p-3 iconBackgroundColor rounded-full relative' >
                                        <IoCartOutline size={24} className='iconsColor' />
                                        {
                                            cart.isGuest == true ? <p className={cart?.guestCart
                                                ?.length != 0 ? "flex absolute top-[-7px] right-0  bodyTextColor textBackground rounded-full h-[18px] w-[18px] items-center justify-center text-center font-bold text-sm" : "none"}> {cart?.guestCart
                                                    ?.length != 0 ? cart?.guestCart
                                                    ?.length : null}</p> :
                                                <p className={cart?.cartProducts?.length != 0 ? "flex absolute bodyTextColor top-[-7px] right-0   textBackground rounded-full text-center h-4 w-4 items-center justify-center p-1 font-bold text-sm" : "none"}> {cart?.cartProducts?.length != 0 ? cart?.cartProducts?.length : null}</p>
                                        }
                                    </span>
                                    <div className='flex flex-col '>
                                        <span className='text-sm'>{t("your_cart")}</span>
                                        <span className='text-base font-bold'>{setting.setting && setting.setting.currency}{
                                            cart.isGuest == true ? cart?.guestCartTotal?.toFixed(2) :
                                                cart?.cartSubTotal?.toFixed(2)
                                        }</span>
                                    </div>
                                </div>
                                {user?.jwtToken !== "" ? <div className='flex gap-2 items-center cursor-pointer' >

                                    <div className='flex '>
                                        <DropdownMenu >
                                            <DropdownMenuTrigger className="flex items-center border-none outline-none gap-2 p-0 shadow-none font-bold text-base ">
                                                <span className='p-3 iconBackgroundColor rounded-full'><IoPersonOutline size={24} className='iconsColor' /></span>
                                                {t("profile")}
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent >
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

                                                <DropdownMenuItem className="items-center flex justify-start h-full">
                                                    <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                                        <BiBookmarkHeart size={22} />
                                                        {t("wishlist")}
                                                    </span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="items-center flex justify-start h-full">
                                                    <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                                        <BiBell size={22} />
                                                        {t("notification")}
                                                    </span>
                                                </DropdownMenuItem>
                                                <Link href={"/profile/address"}>
                                                    <DropdownMenuItem className="items-center flex justify-start h-full">
                                                        <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                                            <IoLocationOutline size={22} />
                                                            {t("myAddress")}
                                                        </span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem className="items-center flex justify-start h-full">
                                                    <span className="flex p-2 gap-2 text-base font-semibold bg-transparent">
                                                        <BiWallet size={22} />
                                                        {t("walletBalance")}
                                                    </span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="items-center flex justify-start h-full" >
                                                    <span className="flex p-2 gap-2 text-base font-semibold bg-transparent" onClick={() => setShowLogout(true)}>
                                                        <RiLogoutCircleRLine size={20} />
                                                        {t("logout")}
                                                    </span>
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div> : <div className='flex gap-2 items-center cursor-pointer' onClick={handleLoginOpen}>
                                    <span className='p-3 iconBackgroundColor rounded-full'><IoPersonOutline size={24} className='iconsColor' /></span>
                                    <div className='flex '>
                                        <span className='text-base font-bold'>{t("login")}</span>
                                    </div>
                                </div>}

                            </div>
                            <div className='flex  md:hidden gap-2 order-3 items-center'>
                                <div >{themes?.theme == "light" ? <FaSun onClick={() => handleChangeTheme('dark')} /> : <FaMoon onClick={() => handleChangeTheme('light')} />}</div>
                                <div onClick={handleCartOpen}><IoCartOutline size={20} /></div>
                            </div>
                        </div>

                    </div>
                    <div className="bottom-header ">
                        <div className="container mx-auto grid grid-cols-12 items-center justify-between mt-2 px-2">
                            {/* First column: col-3 equivalent */}
                            <div className="col-span-4 lg:col-span-3 flex gap-2 items-center cursor-pointer" onClick={handleOpenLocation}>
                                <span className="p-3 iconBackgroundColor  rounded-full">
                                    <IoLocationOutline size={24} className='iconsColor' />
                                </span>
                                <div className="flex flex-col">
                                    <span className="text-sm ">{t("deliver_to")}</span>
                                    <span className="block text-base font-bold overflow-hidden text-ellipsis whitespace-nowrap w-40">
                                        <>
                                            {city.status === 'fulfill'
                                                ? city?.city?.formatted_address
                                                : (
                                                    <div className="d-flex justify-content-center">
                                                        <div className="spinner-border" role="status">
                                                            <span className="visually-hidden">{t("loading")}</span>
                                                        </div>
                                                    </div>
                                                )}
                                        </>

                                    </span>

                                </div>
                            </div>

                            {/* Second column: col-6 equivalent */}
                            <div className="lg:col-span-6 md:col-span-8  items-center headerSearch hidden lg:flex md:flex rounded-[5px]  ml-[20px]">
                                <Select value={filter?.searchedCategory ? Number(filter?.searchedCategory) : "placeholder"} onValueChange={(value) => handleSearchCategory(value)} >
                                    <SelectTrigger className="w-[152px] h-full buttonBackground border-none">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent className="w-[152px] h-full z-10  hidden md:block lg:block">
                                        <SelectItem value="placeholder">All Categories</SelectItem>
                                        {categories?.categories?.map((category) => (
                                            <SelectItem key={category?.id} value={category?.id}>{category?.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="relative flex-grow h-full">
                                    <input
                                        type="text"
                                        placeholder="Search Here..."
                                        className="w-full flex-grow px-4 py-2 text-sm  rounded  focus:outline-none h-full shadow"
                                        value={filter?.search ? filter?.search : searchTerm}
                                        onChange={(e) => handleSearchTerm(e)}
                                    />
                                    <div className="absolute w-full mt-1 flex flex-wrap items-center pr-3 z-10 bodyBackgroundColor">
                                        {Array.from({ length: 0 })?.map((_, idx) => (
                                            <SearchProductCard key={idx} />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    className="p-[20px] col-span-4 h-full flex items-center rounded font-medium text-whiterounded  focus:outline-none focus:ring-2 focus:ring-offset-2 bg-[#29363f] text-white text-xl shadow"
                                    onClick={() => router.push("/products")}
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
                </div>


                <CartDrawer showCart={showCart} setShowCart={setShowCart} setMobileActiveKey={setMobileActiveKey} />
                <Login showLogin={showLogin} setShowLogin={setShowLogin} setMobileActiveKey={setMobileActiveKey} />
                <Location showLocation={showLocation} setShowLocation={setShowLocation} />
                <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
            </section>
            <section className='fixed bottom-0 left-0 w-full z-50 md:hidden backgroundColor pt-3'>
                <div className='container flex items-center justify-center px-2 ' >
                    <div className='flex  justify-between gap-16'>
                        <div className={`flex flex-col items-center gap-1`} onClick={handleHomeClick}><IoHomeOutline size={24} className={`h-10 w-10 ${mobileActiveKey == 1 ? 'primaryBackColor text-white  ' : 'bg-[#55AE7B14] primaryColor '}p-2 rounded-full`} /><span className='text-sm'>{t("home")}</span></div>

                        <div className={`flex flex-col items-center gap-1`} ><IoSearchOutline size={24} className={`h-10 w-10 ${mobileActiveKey == 2 ? 'primaryBackColor text-white ' : 'bg-[#55AE7B14] primaryColor '} p-2 rounded-full`} /><span className='text-sm'>{t("search")}</span></div>

                        <div className={`flex flex-col items-center gap-1`} onClick={handleProfileClick}><FaRegUser size={24} className={`h-10 w-10 ${mobileActiveKey == 3 ? 'primaryBackColor text-white ' : 'bg-[#55AE7B14] primaryColor '} p-2 rounded-full`} /><span className='text-sm'>{user?.jwtToken ? t("profile") : t("login")}</span></div>
                    </div>
                </div>
            </section>
            <ProfileDrawer showProfile={showProfile} setShowProfile={setShowProfile} setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
        </>
    )
}

export default Header