import React from 'react'
import { t } from "@/utils/translation"
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from "react-icons/ri";
const Address = () => {
    return (
        <div className='w-full cardBorder rounded-sm '>

            <div className='buttonBackground flex justify-between p-4 items-center'>
                <h2 className='font-bold text-xl'>{t("manage_address")}</h2>
                <button className=' flex items-center gap-2 py-2 px-3 rounded-sm text-base font-medium primaryBackColor text-white'><CiCirclePlus size={25} className='font-bold' />{t("add_new_address")}</button>
            </div>
            <div>
                <div className=" p-4  w-full cardBorder">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-lg">Delivery to: <span className="font-bold">Divy Jani</span></h2>
                        <div className="flex items-center">
                            <input type="checkbox" id="default-address" checked className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                            <label for="default-address" className="ml-2 text-sm">Home</label>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">This is Default Address</p>
                    <p className="text-sm text-gray-800 mb-4">
                        40 Mossadak, Ad Doqi, Dokki, Giza Governorate 3751112, Egypt, this is landmark, Dokki, Giza, Giza Governorate, 123-Egypt
                    </p>
                    <div className='flex  items-center justify-between p-4 buttonBackground rounded-sm'>
                        <p className="text-base font-medium text-gray-800 ">Phone: <span className="font-medium">0123456789</span></p>
                        <div className="flex space-x-4 ">
                            <button className="flex items-center gap-1 text-base font-medium ">
                                <FaRegEdit size={18} />Edit
                            </button>
                            <span className='p-1 border-r-2'></span>
                            <button className="flex items-center text-base font-medium gap-1  ">
                                <RiDeleteBinLine size={18} />
                                Delete
                            </button>
                        </div>
                    </div>

                </div>
                <div className=" p-4  w-full cardBorder">
                    <div className="flex justify-between items-start mb-2">
                        <h2 className="font-semibold text-lg">Delivery to: <span className="font-bold">Divy Jani</span></h2>
                        <div className="flex items-center">
                            <input type="checkbox" id="default-address" checked className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                            <label for="default-address" className="ml-2 text-sm">Home</label>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">This is Default Address</p>
                    <p className="text-sm text-gray-800 mb-4">
                        40 Mossadak, Ad Doqi, Dokki, Giza Governorate 3751112, Egypt, this is landmark, Dokki, Giza, Giza Governorate, 123-Egypt
                    </p>
                    <div className='flex  items-center justify-between p-4 buttonBackground rounded-sm'>
                        <p className="text-base font-medium text-gray-800 ">Phone: <span className="font-medium">0123456789</span></p>
                        <div className="flex space-x-4 ">
                            <button className="flex items-center gap-1 text-base font-medium ">
                                <FaRegEdit size={18} />Edit
                            </button>
                            <span className='p-1 border-r-2'></span>
                            <button className="flex items-center text-base font-medium gap-1  ">
                                <RiDeleteBinLine size={18} />
                                Delete
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Address