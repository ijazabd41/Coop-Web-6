import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog"
import { useSelector, useDispatch } from 'react-redux';
import { t } from "@/utils/translation";
import Image from "next/image";
import Logo from "/public/logo.png";
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { IoIosCloseCircle } from 'react-icons/io';

const NewUserModal = ({ showNewUser, setShowNewUser, setUserName, setPhoneNumberWithoutCountryCode, setEmail, userName, email, phoneNumberWithoutCountryCode, countryCode }) => {

  const dispatch = useDispatch()


  const authType = useSelector((state) => state.User.authType)

  const handleChangeUserName = (e) => {
    setUserName(e.target.value)
  }
  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleChangePhoneNumber = (e) => {
    setPhoneNumberWithoutCountryCode(e.target.value)
  }

  const handleUserRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await api.registerUser({ name: userName, email: email, mobile: phoneNumberWithoutCountryCode, country_code: countryCode, type: authType })
      if (result?.status == 1) {
        console.log("result", result)
      } else {
        toast.error(t(result?.message))
      }
    } catch (error) {
      console.log("error", error)
    }
  }


  return (
    <Dialog open={showNewUser}  >
      <DialogContent className="">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div className="relative aspect-square object-cover h-[68px] w-[72px]">
            <Image src={Logo} alt="logo" fill className=" aspect-square w-full h-full object-cover" />
          </div>
          <div>
            <IoIosCloseCircle size={32} onClick={() => setShowNewUser(false)} />
          </div>
        </DialogHeader>
        <div>
          <p className='text-xs text-center mb-2'>Note: You have to Update Your Profile For Login Purposes</p>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("name")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm disabled:text-gray-500' placeholder={t("name")} value={userName} disabled={(authType == "email" || authType == "google") ? true : false} onChange={handleChangeUserName} />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("email")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm disabled:text-gray-500' placeholder={t("email")} value={email} disabled={(authType == "email" || authType == "google") ? true : false}
                onChange={handleChangeEmail} />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("mobileNumber")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm disabled:text-gray-400' placeholder={t("mobileNumber")} value={phoneNumberWithoutCountryCode} disabled={(authType == "phone") ? true : false} onChange={handleChangePhoneNumber} />
            </div>
            <buttton className="bg-[#29363F] py-2 my-2 px-4 cursor-pointer text-white text-center rounded-sm text-xl font-normal" onClick={handleUserRegister}>{t("register")}</buttton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewUserModal;