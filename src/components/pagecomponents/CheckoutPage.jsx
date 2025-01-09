import React from 'react'
import dynamic from 'next/dynamic'

const Checkout = dynamic(() => import('../checkoutpage/Checkout'), { ssr: false });
import Layout from '../layout/Layout'

const CheckoutPage = () => {
    return (
        <Layout>
            <Checkout />
        </Layout>
    )
}

export default CheckoutPage