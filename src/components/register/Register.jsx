import React, { useEffect, useState } from 'react'
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
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthType } from '@/redux/slices/userSlice';


const Register = ({ showRegister, setShowRegister, setIsOTP, email, setEmail }) => {

    const dispatch = useDispatch();

    const setting = useSelector(state => state.Setting.setting)
    const language = useSelector(state => state.Language.selectedLanguage)

    useEffect(() => {
        setCountryCode(process.env.NEXT_PUBLIC_APP_COUNTRY_DIAL_CODE)
    }, [])
    const [name, setName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] = useState(null)
    const [password, setPassword] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [errorType, setErrorType] = useState("")



    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPass(!showConfirmPass)
    }

    const handleUsernameChange = (e) => {
        setName(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }

    const handlePhoneNumberChange = (value, data) => {
        const phoneWithoutDialCode = value.startsWith(data?.dialCode)
            ? value.slice(data.dialCode.length)
            : value;
        setPhoneNumber(`${value}`);
        setPhoneNumberWithoutCountryCode(phoneWithoutDialCode);
        setCountryCode("+" + (data?.dialCode || ""));
    }

    const handleUserRegister = async (e) => {
        const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        e.preventDefault();
        try {
            if (!name) {
                setError(t("please_enter_name"))
                setErrorType("name")
                return;
            }
            else if (!emailRegexPattern.test(email)) {
                setError(t("please_enter_email"))
                setErrorType("email")
                return;
            }
            else if (password.length < 6) {
                setError(t("please_enter_password"))
                setErrorType("password")
                return;
            } else if (!confirmPassword) {
                setError(t("please_enter_confirm_password"))
                setErrorType("confirmpassword")
                return;
            } else if (confirmPassword !== password) {
                setError(t("confirm_password_message"))
                setErrorType("confirmpassword")
                return;
            } else {
                setIsLoading(true);
                const res = await api.registerUser({ id: email, name: name, email: email, mobile: phoneNumberWithoutCountryCode, type: 'email', country_code: countryCode, password: password })
                if (res.status == 1) {
                    setIsLoading(false)
                    dispatch(setAuthType({ data: "email" }))
                    setShowRegister(false);
                    toast.success(t(res?.message));
                    setIsOTP(true);
                    // setTimer(90)
                    setPassword("")
                    setName("")
                    setPhoneNumberWithoutCountryCode("")
                    setConfirmPassword("")
                    setPhoneNumber("")
                } else {
                    setIsLoading(false)
                    toast.error(t(res.message))
                    setShowRegister(false);
                    setPassword("")
                    setName("")
                    setConfirmPassword("")
                    setPhoneNumber("")
                    setPhoneNumberWithoutCountryCode("")
                }
            }

        } catch (error) {
            console.log("error", error)
        }
    }

    const handleCloseRegister = () => {
        setShowRegister(false);
        setPassword("")
        setName("")
        setConfirmPassword("")
        setPhoneNumber("")
        setPhoneNumberWithoutCountryCode("")
        setError("")
        setErrorType("")

    }

    return (
        <Dialog open={showRegister} >
            <DialogContent className="">
                <DialogHeader className="flex justify-between flex-row items-center">
                    <div className="relative aspect-square object-cover h-[68px] w-[72px]">
                        <Image src={Logo} alt="logo" fill className=" aspect-square w-full h-full object-cover" />
                    </div>
                    <div>
                        <IoIosCloseCircle size={32} onClick={() => setShowRegister(false)} />
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
                            <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_name")} value={name} onChange={handleUsernameChange} />
                            {error && errorType == "name" && <span className='text-xs text-red-500'>{error}</span>}
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("email")}<span className='text-red-500'>*</span></span>
                            <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("please_enter_email")} value={email} onChange={handleEmailChange} />
                            {error && errorType == "email" && <span className='text-xs text-red-500'>{error}</span>}
                        </div>
                        <div className='flex flex-col gap-1 pl-0'>
                            <span className='font-bold text-base'>{t("mobileNumber")}<span className='text-red-500'>*</span></span>
                            <PhoneInput
                                inputStyle={{ direction: language?.type }}
                                country={process.env.NEXT_PUBLIC_APP_DEFAULT_COUNTRY_CODE}
                                value={phoneNumber}
                                onChange={(phone, data) => handlePhoneNumberChange(phone, data)}
                                onCountryChange={(code) => setCountryCode(code)}
                                className='w-full '
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("password")}<span className='text-red-500'>*</span></span>
                            <div className='relative w-full '>
                                <input type={showPassword ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_password")} value={password} onChange={handlePasswordChange} />
                                <span className='absolute right-3 top-3' onClick={handleShowPassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                {error && errorType == "password" && <span className='text-xs text-red-500'>{error}</span>}
                            </div>

                        </div>
                        <div className='flex flex-col gap-1'>
                            <span className='font-bold text-base'>{t("confirmPassword")}<span className='text-red-500'>*</span></span>
                            <div className='relative w-full '>
                                <input type={showConfirmPass ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_confirm_password")} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                                <span className='absolute right-3 top-3' onClick={handleShowConfirmPassword}>{showConfirmPass ? <FaEyeSlash /> : <FaEye />}</span>
                                {error && errorType == "confirmpassword" && <span className='text-xs text-red-500'>{error}</span>}
                            </div>
                        </div>
                    </div>
                    <div className='mt-4 flex flex-col justify-center text-center gap-3'>
                        <button onClick={handleUserRegister} className="bg-[#29363F] py-2 px-4 text-white text-center rounded-sm text-xl font-normal" disabled={isLoading}>{isLoading ? t("loading") : t("register")}</button>
                        <span className=' text-base font-medium  ml-[2px] ' onClick={handleCloseRegister}>{t("alreadyHaveAnAccount")} <span className='primaryColor underline cursor-pointer'>{t("signIn")}</span></span>
                    </div>
                    <div className="flex items-center justify-between my-4 gap-2">
                        <hr className="flex-grow border-t-2 border-dashed border-gray-300" />
                        <span className=" text-[#4B6272] font-bold text-base">{t("or")}</span>
                        <hr className="flex-grow border-t-2 border-dashed border-gray-300" />
                    </div>
                    <div className="my-4">
                        <button className="w-full border-[1px] py-2  px-4 rounded-sm  gap-2 flex items-center justify-center text-base font-normal"><Image src={GoogleLogo} alt="Google logo" height={30} width={30} className="h-[30px] w-[30px] object-cover " /> {t("continue_with_google")}</button>
                    </div>
                    <div className="py-6 flex items-center justify-center">
                        <p className=" text-center ">
                            {t("agreement_updated_message")} {setting?.web_setting?.site_title} {t("terms_of_service")} {t("and")} {t("privacy_policy")}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    )
}

export default Register