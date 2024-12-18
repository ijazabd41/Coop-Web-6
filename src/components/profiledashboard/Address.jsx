import React from 'react'
import { t } from "@/utils/translation"
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from "react-icons/ri";
import AddressCard from '../cards/AddressCard';
const Address = () => {
    return (
        <div className='w-full cardBorder rounded-sm '>

            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("manage_address")}</h2>
                <button className=' flex items-center gap-2 py-2 px-3 rounded-sm text-base font-medium primaryBackColor text-white'><CiCirclePlus size={25} className='font-bold' />{t("add_new_address")}</button>
            </div>
            <div className=''>
                <AddressCard />
                <AddressCard />
                <AddressCard />

            </div>

        </div>
    )
}

export default Address