import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import OrderSuccessModal from '../paymentstatusmodals/OrderSuccessModal';
import OrderFailedModal from '../paymentstatusmodals/OrderFailedModal';
import * as api from "@/api/apiRoutes"
import { clearCartPromo, setCart, setCartProducts } from '@/redux/slices/cartSlice';
import { clearCheckout } from '@/redux/slices/checkoutSlice';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

const PaymentStatus = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { query } = router;

    const [showOrderSuccess, setShowOrderSuccess] = useState(false)
    const [showOrderFailed, setShowOrderFailed] = useState(false)
    const [showOrderPending, setShowOrderPending] = useState(false)

    const [showWalletSuccess, setShowWalletSuccess] = useState(false)
    const [showWalletPending, setShowWalletPending] = useState(false)
    const [showWalletFailed, setShowWalletFailed] = useState(false)

    const checkPaymentStatus = (query) => {
        if (!query || Object.keys(query).length === 0) return null;

        const { status, status_code, transaction_status } = query;

        // Check for pending status first
        if (status === 'pending' || transaction_status === 'pending') {
            return 'pending';
        }

        // Check for success status
        if (
            status === 'success' ||
            status === 'PAYMENT_SUCCESS' ||
            (status_code === '200' && transaction_status === 'capture')
        ) {
            return 'success';
        }

        // If neither success nor pending, then it's failed
        return 'failed';
    };

    const isWalletTransaction = (query) => {
        if (!query) return false;
        const { type, order_id } = query;
        return type === 'wallet' || order_id?.startsWith('wallet-');
    };


    useEffect(() => {
        if (!query || Object.keys(query).length === 0) return;

        const paymentStatus = checkPaymentStatus(query);
        const isWallet = isWalletTransaction(query);

        console.log("paymentStatus:", paymentStatus, "isWallet:", isWallet)

        if (isWallet) {
            console.log("Wallet Payment");
            switch (paymentStatus) {
                case 'success':
                    setShowWalletSuccess(true);
                    break;
                case 'pending':
                    // Handle pending wallet transactions
                    setShowWalletPending(true);
                    break;
                case 'failed':
                    setShowWalletFailed(true)
                    break;
            }
        } else {
            console.log("Order Payment");
            switch (paymentStatus) {
                case 'success':
                    setShowOrderSuccess(true);
                    break;
                case 'pending':
                    // Handle pending orders
                    setShowOrderPending(true);
                    break;
                case 'failed':
                    setShowOrderFailed(true);
                    break;
            }
        }
    }, [query]);

    useEffect(() => {
        if (showOrderSuccess) {
            console.log("Order Placed Successfully");
        } else if (showOrderFailed) {
            console.log("Order Failed");
        } else if (showOrderPending) {
            console.log("Order Pending");
        }
    }, [showOrderSuccess, showOrderFailed, showOrderPending])

    useEffect(() => {
        if (showWalletSuccess) {
            console.log("Wallet Transaction Successfull");
        } else if (showWalletFailed) {
            console.log("Wallet Transaction Failed");
        } else if (showWalletPending) {
            console.log("Wallet Transaction Pending");
        }
    }, [showWalletSuccess, showWalletFailed, showWalletPending])

    // useEffect(() => {
    //     // Ensure the query is populated before proceeding
    //     if (!query || Object.keys(query).length === 0) return;
    //     console.log("query from useEffect", query)
    //     if (
    //         query?.status === "success" ||
    //         query?.status === "PAYMENT_SUCCESS" ||
    //         query?.transaction_status === "capture"
    //     ) {
    //         setShowOrderSuccess(true);
    //     } else {
    //         setShowOrderFailed(true);
    //     }
    // }, [query]);

    // useEffect(() => {
    //     if (showOrderSuccess) {
    //         setTimeout(() => {
    //             handlePaymentClose();
    //         }, 5000)
    //     } else {
    //         setTimeout(() => {
    //             handleFailedOrder();
    //         }, 5000)
    //     }
    // }, [showOrderSuccess, showOrderFailed])

    // http://localhost:3000/web-payment-status?status=success&type=order&payment_method=Cashfree
    // https://devegrocer.thewrteam.in/web-payment-status?status=success&type=order&payment_method=Cashfree

    // https://devegrocer.thewrteam.in/web-payment-status?order_id=order-217-107&status_code=200&transaction_status=capture


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
                router.replace("/")
            } else {
                console.log("Error", response)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const extractOrderNumber = (orderId) => {
        if (!orderId) return null;
        const regex = /^order-(\d+)-\d+$/;
        const match = orderId.match(regex);
        return match ? match[1] : /^\d+$/.test(orderId) ? orderId : null;
    };


    const handleFailedOrder = async () => {
        if (!query || Object.keys(query).length === 0) return;
        const extractOrderId = extractOrderNumber(query?.order_id)
        try {
            const response = await api.deleteOrder({ orderId: extractOrderId })
            setShowOrderFailed(false)
            dispatch(clearCheckout())
            router.push("/")
        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <section>
            <div className='container'>
                {showOrderSuccess == true ? <OrderSuccessModal showOrderSuccess={showOrderSuccess} handlePaymentClose={handlePaymentClose} /> : <OrderFailedModal showOrderFailed={showOrderFailed} handleFailedOrder={handleFailedOrder} />}
            </div>
        </section>
    )
}

export default PaymentStatus