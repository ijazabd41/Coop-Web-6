import react, { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { t } from "@/utils/translation";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Link from "next/link";

export function Login({ showLogin, setShowLogin }) {

    const [isOTP, setIsOTP] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [otp, setOtp] = useState(null);
    const [email, setEmail] = useState(null)
    const [countryCode, setCountryCode] = useState(null)
    const [inputValue, setInputValue] = useState(null)


    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }

    return (
        <Dialog open={showLogin} onOpenChange={setShowLogin} >
            <DialogContent className="px-[45px]">
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
                                    <h5>{t("enter_verification_code")}</h5>
                                    <span className='flex flex-col text-start item-start otp-message'>{t("otp_send_message")} <p className='font-weight-bold py-2 text-secondary'>email</p></span>
                                </>
                            )
                            : (
                                <div className="flex flex-col">
                                    <h5 className="text-[40px] font-bold textColor">{t("welcome")}</h5>
                                    <span className="textColor text-xs">{t("login_message")}</span>
                                </div>
                            )}
                    </div>

                    <div className="my-8 flex flex-col gap-2">
                        <label htmlFor="email" className="text-base font-bold">{t("loginBoxMessage")}</label>
                        <input type="text" value={inputValue} onChange={handleInputChange} placeholder={t("loginBoxMessage")} className="w-full cardBorder px-4 py-2 text-base outline-none rounded-sm" />
                        <button className="bg-[#29363F] w-full px-4 py-2 text-white rounded-sm text-xl font-normal mt-8">{t("continue")}</button>
                        <h2 className="mt-3 flex text-center">{t("registerMsg")}<Link href={"/"}>{t("registerNow")}</Link></h2>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    )
}

export default Login;
