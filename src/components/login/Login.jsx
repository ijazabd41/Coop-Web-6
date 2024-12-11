"use client"
import react, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import Image from "next/image";
import Logo from "/public/logo.png";
import { t } from "@/utils/translation";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Link from "next/link";
import GoogleLogo from "@/assets/googleLogin.svg"
import OtpInput from 'react-otp-input';
import { useDispatch, useSelector } from "react-redux";
import { setAuthId, setAuthType, setCurrentUser } from "@/redux/slices/userSlice";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from 'react-toastify';
import { signInWithPhoneNumber, GoogleAuthProvider, signInWithPopup, RecaptchaVerifier } from "firebase/auth";
import FirebaseData from '@/utils/firebase';
import * as api from "@/api/apiRoutes"
import { setTokenThunk } from "@/redux/thunk/loginthunk";
import Loader from "../loader/Loader";


export function Login({ showLogin, setShowLogin, setShowRegister }) {
    const setting = useSelector(state => state.Setting)
    const { auth, app, messaging } = FirebaseData();
    const defaultCountryCode = "in"

    const dispatch = useDispatch()
    const inputRef = useRef(null);

    const [isOTP, setIsOTP] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [otp, setOtp] = useState(null);
    const [email, setEmail] = useState(null)
    const [countryCode, setCountryCode] = useState(null)
    const [inputValue, setInputValue] = useState(null);
    const [inputType, setInputType] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState("")
    const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] = useState("")
    const [Uid, setUid] = useState("");
    const [loading, setLoading] = useState(false)
    const [timer, setTimer] = useState(0)
    const [error, setError] = useState("")
    const [userAuthType, setUserAuthType] = useState("")
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputType]);
    useEffect(() => {
        generateRecaptcha();
        return () => {
            const recaptchaContainer = document.getElementById("recaptcha-container");
            if (recaptchaContainer) {
                recaptchaContainer.innerHTML = "";
            }
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
                window.recaptchaVerifier = null;
            }
        };
    }, []);
    const recaptchaClear = async () => {
        const recaptchaContainer = document.getElementById('recaptcha-container')
        if (recaptchaContainer) {
            recaptchaContainer.innerHTML = ''
        }
        if (window.recaptchaVerifier) {
            window?.recaptchaVerifier?.recaptcha?.reset()
        }
    }
    const generateRecaptcha = () => {
        if (!window.recaptchaVerifier) {

            const recaptchaContainer = document.getElementById("recaptcha-container");
            if (!recaptchaContainer) {
                console.error("Container element 'recaptcha-container' not found.");
                return null;
            }
            try {
                recaptchaContainer.innerHTML = '';
                window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                    size: "invisible",
                });
                return window.recaptchaVerifier;
            } catch (error) {
                console.error("Error initializing RecaptchaVerifier:", error.message);
                return null;
            }
        }
        return window.recaptchaVerifier;
    };
    const handleShowRegister = () => {
        setShowRegister(true)
    }
    const handleInputChange = (value, data) => {
        const emailRegexPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const containsOnlyDigits = /^\d+$/.test(value);
        setInputValue(value);
        if (emailRegexPattern.test(value)) {
            setInputType("email");
            setEmail(value);
            setOtp("");
            setPhoneNumber("");
            setCountryCode("");
            dispatch(setAuthType({ data: "email" }));
        } else if (containsOnlyDigits) {
            setInputType("number");
            dispatch(setAuthType({ data: "phone" }));
            const dialCode = data?.dialCode || "";
            const phoneWithoutDialCode = value.startsWith(dialCode)
                ? value.slice(dialCode.length)
                : value;
            setPhoneNumber(`+${value}`);
            setPhoneNumberWithoutCountryCode(phoneWithoutDialCode);
            setCountryCode("+" + dialCode);
            setOtp("");
        } else {
            setInputType("");
        }
    };
    const handleSendOTP = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (phoneNumber?.length < countryCode.length || phoneNumber?.slice(1) === countryCode) {
            setError("Please enter phone number!");
            setLoading(false);
        }
        else {
            const phoneNumberWithoutSpaces = `${phoneNumber}`.replace(/\s+/g, "");
            if (setting?.setting?.firebase_authentication == 1) {
                const appVerifier = generateRecaptcha();
                try {
                    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumberWithoutSpaces, appVerifier)
                    window.confirmationResult = confirmationResult;
                    setTimer(90)
                    setIsOTP(true)
                    setLoading(false)
                } catch (error) {
                    setPhoneNumber();
                    setError(error.message);
                    setLoading(false);
                    console.log("firebase error", error)
                }
            } else if (setting?.setting?.custom_sms_gateway_otp_based == 1) {
                try {
                    const res = await newApi.sendSms({ mobile: phoneNumberWithoutSpaces })
                    if (res?.status == 1) {
                        setTimer(90)
                        setIsOTP(true)
                        setLoading(false)
                    } else {
                        setError(t("custom_send_sms_error_message"));
                        setLoading(false)
                    }

                } catch (error) {
                    setPhoneNumber();
                    setError(t("custom_send_sms_error_message"));
                    setLoading(false)
                }
            } else {
                toast.error(t("Something went wrong"))
            }

        }
    };
    const handleOtpVerification = async (e) => {
        e.preventDefault();
        if (otp == "") {
            toast.error(t("otp_required"))
        }
        try {
            setLoading(true)
            const user = await window.confirmationResult.confirm(otp)
            dispatch(setAuthId({ data: user.user.id }))
            setUid(user.user.id)
            const loginResponse = await loginApiCall(user.user, phoneNumberWithoutCountryCode, "", "phone")
        } catch (error) {
            console.log("error", error)
            // setError(error)
        }
    }

    const loginApiCall = async (user, id, fcm, type) => {
        let latitude;
        let longitude;
        try {
            // await app.auth().setPersistence(app.auth.Auth.Persistence.NONE);
            // await app.auth().currentUser?.getIdToken(true);
            dispatch(setAuthId({ data: Uid, type }))
            const res = await api.login({ id: id, fcm, type })

            if (res.status === 1) {
                console.log("token", res?.data?.access_token)
                const tokenSet = await dispatch(setTokenThunk(res?.data?.access_token))
                await getCurrentUser()
                dispatch(setAuthType({ data: type }))
                // if (res?.data?.user?.status == 1) {
                //     dispatch(setIsGuest({ data: false }));
                // }
                // await handleFetchSetting();
                // latitude = city?.city?.latitude || setting?.setting?.default_city?.latitude
                // longitude = city?.city?.longitude || setting?.setting?.default_city?.longitude
                // if (cart?.isGuest === true && cart?.guestCart?.length !== 0 && res?.data?.user?.status == 1) {
                //     await AddtoCartBulk(res?.data.access_token);
                // }
                // await fetchCart(latitude, longitude);
                setError("");
                setOtp("");
                setPhoneNumber("");
                setLoading(false);
                setIsOTP(false);
                setShowLogin(false);
                setShowRegister(false)
            } else {
                setUserAuthType(type)
                setEmail(user?.providerData?.[0]?.email)
                // setUserName(user?.providerData?.[0]?.displayName)
                setPhoneNumber(user?.providerData?.[0]?.phoneNumber)
                // setRegisterModalShow(true)
                showLogin(false);
            }
            setLoading(false)
        } catch (error) {
            console.error("error", error)
            setLoading(false)
        }
    }

    const getCurrentUser = async () => {
        try {
            const response = await api.getUser()
            dispatch(setCurrentUser({ data: response.user }));
            toast.success("You're successfully Logged In");
        } catch (error) {
            console.log("error", error)
        }
    };

    const handlePasswordShow = () => {
        setShowPassword(!showPassword)
    }
    const handleHideLogin = async () => {
        await recaptchaClear()
        setShowLogin(false)
    }

    return (
        <>
            <Dialog open={showLogin} onOpenChange={handleHideLogin} >
                <DialogContent className="">
                    <DialogHeader className="flex justify-center">
                        <div className="relative aspect-square object-cover h-[68px] w-[72px]">
                            <Image src={Logo} alt="logo" fill className=" aspect-square w-full h-full object-cover" />
                        </div>
                    </DialogHeader>
                    <div className="">
                        <div className="my-6">
                            {isOTP
                                ? (
                                    <>
                                        <div className="flex flex-col ">
                                            <h5 className="text-[22px] text-wrap font-bold textColor">{t("enter_verification_code")}</h5>
                                            <span className='flex flex-col text-start item-start '>{t("otp_send_message")}
                                                <p className='font-weight-bold py-2'>email</p></span>
                                        </div>

                                    </>
                                )
                                : (
                                    <div className="flex flex-col ">
                                        <h5 className="text-[40px] font-bold textColor">{t("welcome")}</h5>
                                        <span className="textColor text-xs">{t("login_message")}</span>
                                    </div>
                                )}
                        </div>
                        <div>
                            {isOTP ?
                                <form onSubmit={handleOtpVerification}>
                                    <div className="overflow-auto p-0 flex items-center justify-center">
                                        {error ? <p>{error}</p> : <></>}
                                        <OtpInput
                                            className=" mx-auto items-center flex flex-wrap justify-center p-0"
                                            value={otp}
                                            onChange={setOtp}
                                            numInputs={6}
                                            renderInput={(props) => <input {...props} className="border border-gray-300 mx-1 md:mx-2 rounded-sm text-black bg text-center 
                                      p-2 w-10 md:w-[62px] "
                                                style={{
                                                    color: 'black',
                                                    backgroundColor: 'white',
                                                    fontSize: '16px'
                                                }}
                                            />}
                                        />

                                    </div>
                                    <div className="mt-8 flex justify-center ">
                                        <button className="w-full bg-[#29363F] text-white text-xl py-2 rounded-sm" type="submit">{t("login")}</button>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span className="text-base font-medium">Resend OTP in : 01:22</span>
                                    </div>
                                </form>
                                :
                                <> <form className="my-4 flex flex-col gap-2 " onSubmit={handleSendOTP}>
                                    {inputType == "number" ?
                                        <>
                                            {error ? <p>{error}</p> : <></>}
                                            {loading ? <Loader /> : <></>}
                                            <>
                                                <PhoneInput
                                                    country={defaultCountryCode}
                                                    value={phoneNumber}
                                                    onChange={(phone, data) => handleInputChange(phone, data)}
                                                    onCountryChange={(code) => setCountryCode(code)}
                                                    inputProps={{
                                                        name: "phone",
                                                        required: true,
                                                        autoFocus: true,
                                                    }}
                                                />

                                            </>
                                        </> :
                                        inputType == "email" ?
                                            <>
                                                <div className='relative'>
                                                    <input value={inputValue} onChange={(e) => handleInputChange(e.target.value, {})} className='border-black border-[1px] py-2 px-4 rounded-sm w-full ' placeholder={t("loginBoxMessage")} ref={inputRef} />

                                                    <input type={showPassword ? "text" : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className='border-black border-[1px] py-2 px-4 rounded-sm w-full mt-4' placeholder={t("passwordMessage")} />
                                                    <div className='absolute right-[10px] top-[72px]' onClick={handlePasswordShow}>
                                                        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                                    </div>
                                                    <div className='text-base font-medium leading-6 mt-2 text-right' >
                                                        <p>{t("forget_password_?")}</p>
                                                    </div>
                                                </div>
                                            </>
                                            : <>   <label htmlFor="email" className="text-base font-bold">{t("loginBoxMessage")}</label>
                                                <input type="text" value={inputValue} onChange={(e) => handleInputChange(e.target.value, {})} placeholder={t("loginBoxMessage")} className="w-full cardBorder px-4 py-2 text-base outline-none rounded-sm" /></>}

                                    <button type="submit" className="bg-[#29363F] w-full px-4 py-2 text-white rounded-sm text-xl font-normal mt-4">{t("continue")}</button>
                                </form>
                                    <h2 className="mt-1 block md:flex justify-start md:justify-center gap-0 md:gap-1 text-base font-medium">{t("registerMsg")}<p onClick={handleShowRegister} className="primaryColor text-base font-medium underline ml-[2px]">{t("registerNow")}</p></h2>
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
                                </>
                            }
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <div id="recaptcha-container" ></div>
        </>
    )
}

export default Login;
