import { t } from '@/utils/translation';
import React, { useState } from 'react'
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAddres } from '@/redux/slices/addressSlice';
import * as api from "@/api/apiRoutes"
import {
    Dialog,
    DialogContent,
    DialogOverlay
} from "@/components/ui/dialog"


const AddressCard = ({ address, setShowAddAddres, setIsAddressSelected, fetchAddress }) => {

    const dispatch = useDispatch();

    const theme = useSelector(state => state.Theme.theme)
    const formattedAddress = `${address?.address}, ${address?.landmark}, ${address?.area}, ${address?.city},${address?.state}, ${address?.pincode}-${address?.country}`
    const [showDeleteModal, setShowDeleteModal] = useState(false)


    const handleDeleteAdress = async () => {
        try {
            const response = await api.deleteAddress({ id: address.id })
            if (response.status == 1) {
                fetchAddress()
                setShowDeleteModal(false)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleEditAddress = () => {
        setShowAddAddres(true)
        setIsAddressSelected(true)
        dispatch(setSelectedAddres({ data: address }))
    }

    return (
        <div className=''>
            <div className=" p-4  w-full cardBorder">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg">Delivery to: <span className="font-bold">{address?.name}</span></h2>
                    <div className="flex items-center">
                        <input type="checkbox" id="default-address" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label for="default-address" className="ml-2 text-sm">{address?.type}</label>
                    </div>
                </div>
                {address?.is_default == 1 ? <p className="text-sm  mb-2">{t("default_address_msg")}</p> : <></>}

                <p className="text-sm  mb-4 font-semibold">
                    {formattedAddress}
                </p>
                <div className='flex  items-center justify-between p-2   buttonBackground rounded-sm'>
                    <p className="text-base font-medium  ">{t("phone")}: <span className="font-medium">{address?.mobile}</span></p>
                    <div className="flex md:space-x-1 flex-col md:flex-row">
                        <button className="flex items-center gap-1 text-base font-medium " onClick={handleEditAddress}>
                            <FaRegEdit size={18} />{t("edit")}
                        </button>
                        <span className='p-1 border-r-2 hidden md:block'></span>
                        <button className="flex items-center text-base font-medium gap-1  " onClick={() => setShowDeleteModal(true)}>
                            <RiDeleteBinLine size={18} />
                            {t("delete")}
                        </button>
                    </div>
                </div>

            </div>
            <Dialog open={showDeleteModal} >
                <DialogOverlay className={`${theme == "light" ? "bg-white/80" : "bg-black/80"}`} />
                <DialogContent>
                    <div>
                        <h1 className='font-bold'>{t("delete_address")}</h1>
                        <h1 className='font-bold'>{t("delete_address_message")}</h1>
                        <div className='flex gap-2 mt-3'>
                            <button className='px-4 py-1 bg-green-700 text-white font-bold rounded-sm' onClick={handleDeleteAdress}>{t("Ok")}</button>
                            <button className='px-4 py-1 bg-red-700 text-white font-bold rounded-sm'
                                onClick={() => (setShowDeleteModal(false))}> {t("cancel")}</button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddressCard