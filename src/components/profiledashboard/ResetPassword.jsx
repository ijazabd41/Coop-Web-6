import { t } from '@/utils/translation'
import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

const ResetPassword = () => {

    const [showPassword, setShowPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    return (
        <div className="w-full mx-auto h-fit border-2   rounded-lg   ">
            <div className='w-full backgroundColor'>
                <h2 className="text-2xl font-semibold  p-4">{t("resetPassword")}</h2>
            </div>
            <div className='  items-center flex  flex-col py-12'>
                <form className='w-3/5 md:w-1/2' >
                    <div>
                        <div className="mb-4 relative">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium "
                            >
                                {t("password")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="name"
                                name="name"
                                placeholder={t("please_enter_password")}
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4 disabled:text-gray-400"
                                required
                            />
                            <div
                                className="absolute right-[12px] top-[36px]"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </div>
                        </div>
                        <div className="mb-4 relative">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium "
                            >
                                {t("newPassword")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="name"
                                name="name"
                                placeholder={t("please_enter_new_password")}
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4 disabled:text-gray-400"
                                required
                            />
                            <div
                                className="absolute right-[12px] top-[36px]"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </div>
                        </div>
                        <div className="mb-4 relative">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium "
                            >
                                {t("confirmPassword")} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="name"
                                name="name"
                                placeholder={t("please_enter_confirm_password")}
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4 disabled:text-gray-400"
                                required
                            />
                            <div
                                className="absolute right-[12px] top-[36px]"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end w-full">
                            <button
                                type="submit"
                                className="w-44 bg-[#29363f]  text-white py-2 px-4 rounded-md "
                            // disabled={isChanged == false}
                            >
                                {t("change_password")}
                            </button>
                        </div>
                    </div>
                </form>

            </div>

        </div>
    )
}

export default ResetPassword;