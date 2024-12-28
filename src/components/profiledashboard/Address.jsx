import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from "react-icons/ri";
import AddressCard from '../cards/AddressCard';
import NewAddressModal from '../newaddressmodal/NewAddressModal';
import * as api from "@/api/apiRoutes"
import { useSelector, useDispatch } from 'react-redux';
import { setAllAddresses } from '@/redux/slices/addressSlice';

const Address = () => {

    const dispatch = useDispatch();
    const addresses = useSelector(state => state.Addresses)
    const [showAddAddres, setShowAddAddres] = useState(false)
    const [isAddressSelected, setIsAddressSelected] = useState(false)
    useEffect(() => {
        fetchAddress()
    }, [])

    const fetchAddress = async () => {
        try {
            const response = await api.getAddress();
            if (response.status == 1) {
                dispatch(setAllAddresses({ data: response.data }))
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleshowAddres = () => {
        setIsAddressSelected(false)
        setShowAddAddres(true)
    }


    return (
        <div className='w-full cardBorder rounded-sm '>

            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("manage_address")}</h2>
                <button className=' flex items-center gap-2 py-2 px-3 rounded-sm text-base font-medium primaryBackColor text-white' onClick={handleshowAddres}><CiCirclePlus size={25} className='font-bold' />{t("add_new_address")}</button>
            </div>
            <div className=''>
                {addresses?.allAddresses && addresses?.allAddresses?.map((address) => {
                    return (
                        <AddressCard address={address} setShowAddAddres={setShowAddAddres} setIsAddressSelected={setIsAddressSelected} fetchAddress={fetchAddress}/>
                    )
                })}


            </div>
            <NewAddressModal showAddAddres={showAddAddres} setShowAddAddres={setShowAddAddres} isAddressSelected={isAddressSelected}  fetchAddress={fetchAddress}/>
        </div>
    )
}

export default Address