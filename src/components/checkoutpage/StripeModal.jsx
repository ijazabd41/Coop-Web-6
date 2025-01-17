import React from 'react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { IoIosCloseCircle } from 'react-icons/io';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSelector } from 'react-redux';
import { t } from '@/utils/translation';


const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const handleOnSubmit = async () => {
        try {

        } catch (error) {
            console.log("Error", error)
        }
    }

    return (
        <form onSubmit={handleOnSubmit}>
            <PaymentElement />
            <button disabled={!stripe}>Submit</button>
        </form>
    )

}

const StripeModal = ({ showStripe, setShowStripe }) => {

    const setting = useSelector(state => state.Setting)

    const stripePromise = loadStripe(setting?.payment_setting && setting?.payment_setting?.stripe_publishable_key)

    const CARD_OPTIONS = {
        iconStyle: "solid",
        style: {
            base: {
                // iconColor: "#c4f0ff",
                fontWeight: 500,
                fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
                fontSize: "16px",
                fontSmoothing: "antialiased",
                ":-webkit-autofill": { color: "#fce883" },
                "::placeholder": { color: "#87bbfd" },
                // border: "2px solid black"
            },
            invalid: {
                // iconColor: "#ffc7ee",
                color: "#ffc7ee"
            }
        }
    };

    return (
        <Dialog open={showStripe}>
            <DialogContent>
                <DialogHeader alogHeader className="flex flex-row justify-between items-center">
                    <div className="relative aspect-square object-cover h-[68px] w-[72px]">
                        <p>{t("stripe")}</p>
                    </div>
                    <div>
                        <IoIosCloseCircle size={32} onClick={() => setShowStripe(false)} />
                    </div>
                </DialogHeader>
                <div>
                    <Elements stripe={stripePromise} options={CARD_OPTIONS}>
                        <CheckoutForm />
                    </Elements>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default StripeModal