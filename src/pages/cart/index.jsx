import React from 'react'
import dynamic from 'next/dynamic'
import MetaData from '@/components/metadata-component/MetaData'

const CartPage = dynamic(()=>import('@/components/pagecomponents/CartPage'),{ssr:false})

const index = () => {
    return (
        <>
            <MetaData pageName="/cart" title={`Cart - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <CartPage />
        </>
    )
}

export default index