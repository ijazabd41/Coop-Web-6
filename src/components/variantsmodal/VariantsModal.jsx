import React, { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaShoppingBasket, FaStar } from 'react-icons/fa'
import Image from 'next/image'
import * as api from "@/api/apiRoutes"
import { useSelector } from 'react-redux'


const VariantsModal = ({ product, showVariants, setShowVariants }) => {

    const setting = useSelector(state => state.Setting)

    return (
        <>
            <Dialog open={showVariants} onOpenChange={setShowVariants}>
                <DialogContent className="max-w-xl ">
                    <DialogHeader className="font-bold text-2xl text-start">Choose Variants</DialogHeader>
                    <div className='p-2 md:p-6'>
                        <div className='backgroundColor rounded-md flex gap-2 p-4 items-center'>
                            <div className='h-[54px] w-[54px] relative rounded-md '>
                                <Image src={product?.image_url} fill alt={product?.name} className='h-full w-full' />
                            </div>
                            <h3 className='font-medium text-base leading-[24px] break-all'>{product?.name}</h3>
                        </div>
                        <div>
                            {product?.variants?.map((variant) => {
                                return (
                                    <div className='flex justify-between items-center px-4 py-2' key={variant?.id}>
                                        <div className='font-medium text-lg'>{`${variant?.measurement} ${variant?.stock_unit_name}`}</div>
                                        <div className='flex items-center gap-1'>
                                            <div className='flex items-center gap-3 font-bold text-base'>{setting?.setting?.currency}{variant?.discounted_price == 0 ? variant?.price : variant?.discounted_price}
                                                <button className='flex gap-1 cartButtonBackground py-2 px-4 rounded-sm primaryColor justify-center font-semibold'><FaShoppingBasket size={20} />Add</button>
                                            </div>

                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}

export default VariantsModal