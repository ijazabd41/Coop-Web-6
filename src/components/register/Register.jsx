import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import Logo from "/public/logo.png";
import { t } from "@/utils/translation"
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import GoogleLogo from "@/assets/googleLogin.svg"


const Register = ({ showRegister, setShowRegister }) => {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [password, setPassword] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    return (
        <Dialog open={showRegister} onOpenChange={setShowRegister} >
            <DialogContent className="">
                <DialogHeader className="flex justify-center">
                    <div className="relative aspect-square object-cover h-[68px] w-[72px]">
                        <Image src={Logo} alt="logo" fill className=" aspect-square w-full h-full object-cover" />
                    </div>
                </DialogHeader>
                <div>
                    <div className="flex flex-col ">
                        <h5 className="text-[34px] font-bold textColor">{t("welcome")}</h5>
                        <span className="textColor text-xs">{t("signupMessage")}</span>
                    </div>
                    <div className='mt-8 flex flex-col gap-2'>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("name")}<span className='text-red-500'>*</span></span>
                            <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_name")} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("email")}<span className='text-red-500'>*</span></span>
                            <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_email")} />
                        </div>
                        <div className='flex flex-col gap-1 pl-0'>
                            <span className='font-bold text-base'>{t("mobileNumber")}<span className='text-red-500'>*</span></span>
                            <PhoneInput
                                country={'us'}
                                value={phoneNumber}
                                onChange={phone => setPhoneNumber({ phone })}
                                className='w-full '
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("password")}<span className='text-red-500'>*</span></span>
                            <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_password")} />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("confirmPassword")}<span className='text-red-500'>*</span></span>
                            <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_confirm_password")} />
                        </div>
                    </div>
                    <div className='mt-4 flex flex-col justify-center text-center gap-3'>
                        <buttton className="bg-[#29363F] py-2 px-4 text-white text-center rounded-sm text-xl font-normal">{t("register")}</buttton>
                        <span className='text-base font-medium'>Already have an account? Sign in</span>
                    </div>
                    <div class="flex items-center justify-between my-4 gap-2">
                        <hr class="flex-grow border-t-2 border-dashed border-gray-300" />
                        <span class=" text-[#4B6272] font-bold text-base">OR</span>
                        <hr class="flex-grow border-t-2 border-dashed border-gray-300" />
                    </div>
                    <div className="my-4">
                        <button className="w-full border-[1px] py-2  px-4 rounded-sm  gap-2 flex items-center justify-center text-base font-normal"><Image src={GoogleLogo} alt="Google logo" height={30} width={30} className="h-[30px] w-[30px] object-cover " /> {t("continue_with_google")}</button>
                    </div>
                    <div className="py-6 flex items-center justify-center">
                        <p className=" text-center ">By creating account you agree to eGrocer
                            Terms of Service and Privacy Policy.</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Register