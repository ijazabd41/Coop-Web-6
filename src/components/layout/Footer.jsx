import { t } from '@/utils/translation'
import React from 'react'
import { BiMessageAltDots } from 'react-icons/bi'
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa'
import { IoLocationOutline } from 'react-icons/io5'
import { MdPhoneInTalk } from 'react-icons/md'

const Footer = () => {
    return (
        <section className='footer'>
            <div className='container text-white px-2'>
                <div className='md:grid lg:grid lg:grid-cols-12 md:grid-cols-12 flex flex-col items-center py-12 border-b-[1px]'>
                    <div className='col-span-6'>
                        <h3>{t("downloadAppsFooter")}</h3>
                        <p className='w-full'>{t("AppsDowloadMsg")}</p>
                    </div>
                    <div className='col-span-6 w-full flex justify-end'>
                        <p>google play store</p>
                        <p>Apple store</p>
                    </div>
                </div>
                <div className='md:grid grid-cols-12 py-12 flex flex-col'>
                    <div className='col-span-4 flex gap-8 flex-col'>
                        <h3 className=''>{t("quick_links")}</h3>
                        <ul className=' flex flex-col gap-4'>
                            <li>{t("home")}</li>
                            <li>{t("about_us")}</li>
                            <li>{t("contact_us")}</li>
                            <li>{t("faq")}</li>
                        </ul>
                        <div className='flex flex-col'>
                            <p>Follow Us</p>
                            <div className='flex gap-4 mt-1 iconBackgroundColor p-4 w-fit rounded-[8px]'>
                                <FaFacebookF size={18} />
                                <FaInstagram size={18} />
                                <FaLinkedinIn size={18} />
                            </div>
                        </div>
                    </div>
                    <div className='col-span-4 flex gap-8 flex-col  mt-12 md:mt-0 '>
                        <h3>{t("company_policy")}</h3>
                        <ul className='flex flex-col gap-4'>
                            <li>{t("terms_and_conditions")}</li>
                            <li>{t("privacy_policy")}</li>
                            <li>{t("return_and_exchange_policy")}</li>
                            <li>{t("shipping_policy")}</li>
                            <li>{t("cancellation_policy")}</li>
                        </ul>
                    </div>
                    <div className='col-span-4 flex gap-8 flex-col mt-12 md:mt-0'>
                        <h3>{t("store_info")}</h3>
                        <div className='flex flex-col gap-6 '>
                            <div className='flex gap-4 items-center'>
                                <span className="p-3 iconBackgroundColor  rounded-[8px]">
                                    <IoLocationOutline size={24} className='iconsColor' />
                                </span>
                                <p>#262-263, Time Square Empire, SH 42 Mirjapar Highway, Bhuj - Kutch 370001 Gujarat India.</p>
                            </div>
                            <div className='flex gap-4 items-center'>
                                <span className="p-3 iconBackgroundColor  rounded-[8px]">
                                    <BiMessageAltDots size={24} className='iconsColor' />
                                </span>
                                <p>eGrocersupport@gmail.com</p>
                            </div>
                            <div className='flex gap-4 items-center'>
                                <span className="p-3 iconBackgroundColor  rounded-[8px]">
                                    <MdPhoneInTalk size={24} className='iconsColor' />
                                </span>
                                <p>+91 0987654321</p>
                            </div>

                        </div>
                    </div>

                </div>

            </div>
            <div className='bottom-footer bg-black text-white'>
                <div className='container  md:grid md:grid-cols-12 p-6 flex flex-col '>
                    <div className='col-span-6 '>Copyright ©️ 2024 All Rights Reserved & Designed by 💕 WRTeam.</div>
                    <div className='col-span-6 md:flex hidden md:justify-end justify-start gap-3'>
                        <p>{t("we_accept")}</p>
                        <div className='flex gap-3'>
                            <FaFacebookF size={18} />
                            <FaInstagram size={18} />
                            <FaLinkedinIn size={18} />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Footer