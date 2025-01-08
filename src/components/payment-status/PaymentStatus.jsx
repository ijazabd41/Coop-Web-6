import React, { useEffect } from 'react'
import { useRouter } from "next/router";
import OrderSuccessModal from '../ordersuccessmodal/OrderSuccessModal';
import * as api from "@/api/apiRoutes"
import { clearCartPromo, setCart, setCartProducts } from '@/redux/slices/cartSlice';
import { clearCheckout } from '@/redux/slices/checkoutSlice';
import { toast } from 'react-toastify';

const PaymentStatus = () => {
    const router = useRouter();
    const { query } = router;

    const [orderStatus, setOrderStatus] = useState("")
    const [showOrderSuccess, setShowOrderSuccess] = useState(false)

    useEffect(() => {
        if (query?.status == "success" || query?.status == "PAYMENT_SUCCESS" || query?.transaction_status == "capture") {
            setShowOrderSuccess(true)
        }
    }, [])

    useEffect(() => {
        if (showOrderSuccess) {
            setTimeout(() => {
                handlePaymentClose();
            }, 5000)
        }
    }, [showOrderSuccess])

    // https://devegrocer.thewrteam.in/web-payment-status?order_id=order-217-107&status_code=200&transaction_status=capture
    // https://devegrocer.thewrteam.in/web-payment-status?status=success&type=order&payment_method=Cashfree

    // https://devegrocer.thewrteam.in/web-payment-status?order_id=order-213-107&status_code=201&transaction_status=pending&action=back

    // https://devegrocer.thewrteam.in/web-payment-status?status=PAYMENT_SUCCESS&type=order&payment_method=Phonepe
    // https://devegrocer.thewrteam.in/web-payment-status?status=&type=order&payment_method=Paytabs&order_id=215

    const handlePaymentClose = async () => {
        try {
            const response = await api.deleteCart();
            if (response.status == 1) {
                dispatch(setCart({ data: [] }))
                dispatch(clearCartPromo())
                dispatch(setCartProducts({ data: [] }))
                dispatch(clearCheckout())
                setShowOrderSuccess(false)
                router.push("/")
            } else {
                console.log("Error", response)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleFailedOrder = async () => {
        const orderId = query.order_id
        try {
            const response = await api.deleteOrder(orderId)
            toast.error("Payment failed")
            dispatch(clearCheckout())
            router.push("/")
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <section>
            <div className='container'>
                {showOrderSuccess ? <OrderSuccessModal showOrderSuccess={showOrderSuccess} handlePaymentClose={handlePaymentClose} /> : <p>Payment cancel</p>}
            </div>
        </section>
    )
}

export default PaymentStatus