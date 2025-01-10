import React from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';

const ReturnReasonModal = ({ showReturnModal, setShowReturnModal }) => {


    const handleHideReturnModal = () => {
        setShowReturnModal(false)
    }

    return (
        <Dialog open={showReturnModal}>
            <DialogContent>
                <DialogHeader className="font-bold text-2xl text-start flex flex-row justify-between">
                    {t("return_reason")}
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleHideReturnModal} />
                    </div>
                </DialogHeader>
                <div>
                    <label htmlFor="">{t("reason")}</label>
                    <div className='flex flex-col gap-1'>
                        <label className='font-medium text-base'>{t("reason")}<span className='text-red-500'>*</span></label>
                        <textarea name="" id="" className='w-full outline-none cardBorder p-2 rounded-sm' placeholder={t("write_return_reason")}></textarea>
                    </div>
                    <div className='flex justify-end'>
                        <button className='py-1 px-3 primaryBackColor text-white rounded-sm font-normal text-xl'>{t("submit")}</button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ReturnReasonModal