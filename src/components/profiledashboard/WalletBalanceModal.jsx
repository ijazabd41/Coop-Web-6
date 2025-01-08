import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { t } from '@/utils/translation';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import * as api from "@/api/apiRoutes";

// payment SVGS
import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg"
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg"
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg"
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg"
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg"
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg"
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg"
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg"
import { IoIosCloseCircle } from 'react-icons/io';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { addUserBalance } from '@/redux/slices/userSlice';


const paymentMethodsConfig = [
    { key: "razorpay_payment_method", label: "razorpay", image: RazorpayImage },
    { key: "paypal_payment_method", label: "paypal", image: PaypalImage },
    { key: "paystack_payment_method", label: "paystack", image: PaystackImage },
    { key: "stripe_payment_method", label: "stripe", image: StriperImage },
    { key: "cashfree_payment_method", label: "cashfree", image: CashfreeImage },
    { key: "midtrans_payment_method", label: "midtrans", image: MidtransImage },
    { key: "phonepay_payment_method", label: "phonepe", image: PhonePeImage },
    { key: "paytabs_payment_method", label: "paytabs", image: PaytabsImage },
];

const WalletBalanceModal = ({ addWalletModal, setAddWalletModal }) => {

    const setting = useSelector(state => state.Setting)
    const user = useSelector((state) => state?.User)
    const dispatch = useDispatch();
    const router = useRouter();

    const [selectedPaymentMethod, setSelectPaymentMethod] = useState()
    const [amount, setAmount] = useState(null);
    const [showStripe, setShowStripe] = useState(false);

    const handleSelectedPaymentMethod = (value) => {
        setSelectPaymentMethod(value)
    }

    const enabledPaymentMethods = paymentMethodsConfig.filter(
        (method) =>
            setting?.payment_setting?.[method.key] &&
            setting?.payment_setting?.[method.key] === "1"
    );

    const handleAmount = (e) => {
        setAmount(Number(e.target.value));
    }

    useEffect(() => {
        if (addWalletModal === false) {
            setSelectPaymentMethod("");
            setAmount(null);
        }
    }, [addWalletModal])

    const handleSuccessWalletAdd = () => {
        setTimeout(() => {
            router.push("/")
        }, 1500);
    }

    const handleSubmit = async () => {
        try {
            const capitalizedPaymentMethod = selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1);
            const result = await api.initiateTrasaction({ paymentMethod: capitalizedPaymentMethod, type: "wallet", walletAmount: amount });
            if(capitalizedPaymentMethod=== "Razorpay"){
                handleRazorpayPayment(null, result?.data?.transaction_id, amount);
            }
            else if (capitalizedPaymentMethod === "Stripe") {
                setShowStripe(true);
            }
        } catch (e) {
            console.log(e?.message)
        }
    }
    const initializeRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            // document.body.appendChild(script);
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async (order_id, razorpay_transaction_id, amount) => {
        try {
            const res = await initializeRazorpay();
            if (!res) {
                console.error("RazorPay SDK Load Failed");
                return;
            }
            const key = setting?.payment_setting?.razorpay_key;
            const convertedAmount = Math.floor(amount * 100);
            const options = {
                key: key,
                amount: convertedAmount,
                currency: "INR",
                name: user?.user?.name,
                description: setting?.setting?.app_name,
                image: setting?.setting?.web_settings.web_logo,
                order_id: razorpay_transaction_id,
                handler: async (res) => {
                    if (res.razorpay_payment_id) {
                        try {
                            console.log("Adding Transaction");
                            const response = await api.addTransaction({
                                // orderId: order_id,
                                transactionId: res.razorpay_payment_id,
                                paymentMethod: selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1),
                                type: "wallet",
                                walletAmount: amount
                            });
                            if (response.status === 1) {
                                toast.success(response.message);
                                console.log("Wallet Amount added", amount)
                                dispatch(addUserBalance({ data: amount }));
                                setAddWalletModal(false);
                                handleSuccessWalletAdd();

                            } else {
                                toast.error(response.message);
                                setAddWalletModal(false);
                            }
                        } catch (error) {
                            console.log("Transaction error:", error);
                        }
                    }
                },
                modal: {
                    confirm_close: true,
                    ondismiss: async (reason) => {
                        // console.log("In ondismiss payment close", reason);
                        if (reason === undefined) {
                            toast.error("Payment Failed");
                            setAddWalletModal(false);
                        }
                    },
                },
                retry: {
                    enabled: false
                },
                prefill: {
                    name: user?.user?.name,
                    email: user?.user?.email,
                    contact: user?.user?.mobile,
                },
                notes: {
                    address: "Razorpay Corporate",
                },
                theme: {
                    color: setting?.setting?.web_settings.color,
                },
            };

            // if (typeof window !== "undefined") {
            const rzpay = new window.Razorpay(options);
            rzpay.on("payment.cancel", (response) => {
                alert("Payment Cancelled");
                // console.log("In payment cancel")
                toast.error("Payment Cancelled");
            });

            rzpay.on("payment.failed", (response) => {
                setAddWalletModal(false);
            });

            rzpay.open();
        } catch (error) {
            console.error("Error initializing Razorpay:", error);
        }

    }


    return (
        <div>
            <Dialog open={addWalletModal} onOpenChange={setAddWalletModal} className="bg-black h-full w-full">
                {addWalletModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-40"></div>
                )}
                <DialogContent aria-describedby="addWalletModal" >
                    <DialogHeader className="flex flex-row justify-between items-center">
                        <DialogTitle>
                            <h1 className='font-bold text-xl'>{t("add_to_wallet")}</h1>
                        </DialogTitle>
                        <div>
                            <IoIosCloseCircle size={32} onClick={() => setAddWalletModal(false)} />
                        </div>
                    </DialogHeader>
                    <div >
                        <div className='flex flex-col gap-8'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="walletAmount" className='text-xl'>{t("amount")}</label>
                                <input type="number" id="walletAmount" value={amount !== null ? amount : ""} placeholder={t("type_amount")} className='py-2 px-4 cardBorder rounded-sm outline-none text-xl placeholder:text-xl' onChange={(e) => handleAmount(e)} />
                            </div>
                            <div className='flex flex-col gap-3'>
                                <h1 className='font-bold text-base'>{t("choose_payment_method")}</h1>
                                <div className='flex flex-col gap-2'>
                                    {enabledPaymentMethods.map((method) => (
                                        <div
                                            key={method.key}
                                            data-method={method.label}
                                            className={`p-2 flex justify-between items-center cardBorder rounded-sm ${selectedPaymentMethod === method.label
                                                ? "bg-[#55ae7b26]"
                                                : ""
                                                }`}
                                            onClick={() => handleSelectedPaymentMethod(method.label)}
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Image
                                                    src={method.image}
                                                    className="h-8 w-8"
                                                    height={0}
                                                    width={0}
                                                    alt={t(method.label)}
                                                />
                                                <p className="font-medium text-base">{t(method.label)}</p>
                                            </div>
                                            <div>
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    className="h-6 w-6 mt-2"
                                                    checked={selectedPaymentMethod === method.label}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <div className='pt-2 flex justify-end'>
                                        <button className='flex justify-end px-4 py-2 primaryBackColor mt-auto self-end text-white rounded-sm text-xl font-normal ' onClick={handleSubmit}>
                                            {t("add_money")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default WalletBalanceModal;