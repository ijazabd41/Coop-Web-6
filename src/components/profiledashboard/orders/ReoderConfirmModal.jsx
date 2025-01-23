import React from 'react'
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import * as api from "@/api/apiRoutes"
import { toast } from 'react-toastify';
import { t } from '@/utils/translation';
import { useSelector } from 'react-redux';

const ReoderConfirmModal = ({ showReoderModal, setShowReorderModal, order }) => {

    const theme = useSelector(state => state.Theme.theme)

    const handleHideReorder = () => {
        setShowReorderModal(false)
    }

    const handleReoder = async () => {
        try {
            const variantIds = order?.items?.map((prdct) => prdct?.variant_id)?.join(',');
            const quantity = order?.items?.map((prdct) => prdct?.quantity)?.join(",")
            const response = await api.addToBulkCart({ variant_ids: variantIds, quantities: quantity })
            if (response.status == 1) {
                toast.success(t("items_added_to_cart"))
                setShowReorderModal(false)
            } else {
                console.log("error", response)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <Dialog open={showReoderModal}>
            <DialogOverlay
                className={`${theme == "light" ? "bg-white/80" : "bg-black/80"}`}
            />
            <DialogContent>
                <div>
                    <h1 className="font-bold">{t("reorder")}</h1>
                    <h1 className="font-bold">{t("reOrder_warning")}</h1>
                    <div className="flex gap-2 mt-3">
                        <button
                            className="px-4 py-1 bg-green-700 text-white font-bold rounded-sm"
                            onClick={handleReoder}
                        >
                            {t("Ok")}
                        </button>
                        <button
                            className="px-4 py-1 bg-red-700 text-white font-bold rounded-sm"
                            onClick={handleHideReorder}
                        >
                            {" "}
                            {t("cancel")}
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ReoderConfirmModal