import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import GoogleLogo from "@/assets/googleLogin.svg"
import { t } from "@/utils/translation";
import Image from "next/image";
import Logo from "/public/logo.png";

const NewUserModal = ({ showNewUser, setShowNewUser }) => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  return (
    <Dialog open={showNewUser} onOpenChange={setShowNewUser} >
      <DialogContent className="">
        <DialogHeader className="flex justify-center">
          <div className="relative aspect-square object-cover h-[68px] w-[72px]">
            <Image src={Logo} alt="logo" fill className=" aspect-square w-full h-full object-cover" />
          </div>
        </DialogHeader>
        <div>
          <p className='text-xs text-center mb-2'>Note: You have to Update Your Profile For Login Purposes</p>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("name")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("name")} />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("email")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("email")} />
            </div>
            <div className='flex flex-col gap-1'>
              <span className='font-bold text-base'>{t("mobileNumber")}</span>
              <input type="text" name="" id="" className='py-2 px-4 cardBorder outline-none rounded-sm' placeholder={t("mobileNumber")} />
            </div>
            <buttton className="bg-[#29363F] py-2 my-2 px-4 text-white text-center rounded-sm text-xl font-normal">{t("register")}</buttton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewUserModal;