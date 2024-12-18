import React from 'react'
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from "react-icons/ri";


const AddressCard = () => {
    return (
        <div className=''>
            <div className=" p-4  w-full cardBorder">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold text-lg">Delivery to: <span className="font-bold">Divy Jani</span></h2>
                    <div className="flex items-center">
                        <input type="checkbox" id="default-address" className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                        <label for="default-address" className="ml-2 text-sm">Home</label>
                    </div>
                </div>
                <p className="text-sm  mb-2">This is Default Address</p>
                <p className="text-sm  mb-4">
                    40 Mossadak, Ad Doqi, Dokki, Giza Governorate 3751112, Egypt, this is landmark, Dokki, Giza, Giza Governorate, 123-Egypt
                </p>
                <div className='flex  items-center justify-between p-2   buttonBackground rounded-sm'>
                    <p className="text-base font-medium  ">Phone: <span className="font-medium">0123456789</span></p>
                    <div className="flex space-x-1">
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
    )
}

export default AddressCard