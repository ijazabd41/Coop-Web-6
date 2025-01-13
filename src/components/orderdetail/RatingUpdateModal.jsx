import React from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';

const RatingUpdateModal = ({ showUpdateRating, setShowUpdateRating }) => {

    const handleHideUpdateRatingModal = () => {
        setShowUpdateRating(false)
    }



    return (
        <Dialog>
            <DialogContent>
                <DialogHeader>
                    {t("rate_the_product")}
                    <div>
                        <IoIosCloseCircle size={32} onClick={handleHideUpdateRatingModal} />
                    </div>
                </DialogHeader>
                <div>

                </div>
            </DialogContent>
        </Dialog>
    )
}

export default RatingUpdateModal