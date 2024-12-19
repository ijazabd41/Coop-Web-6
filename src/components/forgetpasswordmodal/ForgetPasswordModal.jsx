import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { IoIosCloseCircle } from 'react-icons/io'
import { t } from '@/utils/translation'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify'



const ForgetPasswordModal = ({ showForgetPassword, setShowForgetPassword }) => {

    const [stage, setStage] = useState(0)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleOtpChange = (e) => {
        setOtp(e.target.value)
    }


    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value)
    }
    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPass(!showConfirmPass)
    }

    const handleShowModal = () => {
        setStage(0)
        setShowForgetPassword(false)
    }

    const handleForgetPassword = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            const res = await api.forgotPasswordOTP({ email: email });
            if (res.status == 1) {
                setStage(1);
                toast.success(t("verification_mail_sent_successfully"))
                setLoading(false)
            } else {
                if (res.message == "email_is_not_registered") {
                    toast.error(t("email_is_not_registered"))
                    setLoading(false)
                } else {
                    setLoading(false)
                    toast.error(res.message)
                }
            }
        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }

    const handleResetPassword = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            if (password !== confirmPassword) {
                toast.error(t("confirm_password_message"))
                setLoading(false)
                return
            }
            const res = await api.forgotPassword({ email: email, otp: otp, password: password, confirmPassword: confirmPassword })
            if (res.status == 1) {
                setConfirmPassword("")
                setOtp("")
                setPassword("")
                setEmail("")
                setShowForgetPassword(false)
                toast.success(res.message)
                setStage(0);
                setLoading(false)
            } else {
                setLoading(false)
                setStage(1);
                toast.error(res.message)
            }

        } catch (error) {
            setLoading(false)
            console.log("error", error)
        }
    }

    return (
        <Dialog open={showForgetPassword}>
            <DialogContent>
                <DialogHeader className="flex justify-between items-center flex-row">
                    <h1 className='font-bold text-xl'>{t("forget_password")}</h1>
                    <div>
                        <IoIosCloseCircle size={32} onClick={() => handleShowModal()} />
                    </div>
                </DialogHeader>
                <div >
                    {
                        stage == 0 ? <div className='flex flex-col w-full gap-4'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="email" className='font-semibold'>{t("email")}<span className='text-red-500'>*</span></label>
                                <input type="email" placeholder={t("emailPlaceholder")} className='p-2 cardBorder rounded-sm outline-none' value={email} onChange={handleEmailChange} />
                            </div>
                            <button className='primaryBackColor rounded-sm text-white font-medium text-base py-2 ' onClick={handleForgetPassword} disabled={loading}>
                                {loading ? t("loading") : t("get_mail")}
                            </button>
                        </div> : <div className='flex flex-col w-full gap-4'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-bold text-base'>{t("otp")}<span className='text-red-500'>*</span></span>
                                    <div className=''>
                                        <input type="number" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("otpPlaceholder")} value={otp} onChange={handleOtpChange} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-bold text-base'>{t("password")}<span className='text-red-500'>*</span></span>
                                    <div className='relative w-full '>
                                        <input type={showPassword ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_password")} value={password} onChange={handlePasswordChange} />
                                        <span className='absolute right-3 top-3' onClick={handleShowPassword}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                    </div>

                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='font-bold text-base'>{t("confirmPassword")}<span className='text-red-500'>*</span></span>
                                    <div className='relative w-full '>
                                        <input type={showConfirmPass ? "text" : "password"} name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm w-full' placeholder={t("please_enter_confirm_password")} value={confirmPassword} onChange={handleConfirmPasswordChange} />
                                        <span className='absolute right-3 top-3' onClick={handleShowConfirmPassword}>{showConfirmPass ? <FaEyeSlash /> : <FaEye />}</span>
                                    </div>
                                </div>
                                <button className='primaryBackColor rounded-sm text-white font-medium text-base py-2' onClick={handleResetPassword} disabled={loading}>
                                    {loading ? t("reset_password") : t("loading")}
                                </button>
                            </div>
                        </div>
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ForgetPasswordModal