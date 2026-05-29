import React from 'react'
import dynamic from 'next/dynamic'
import MetaData from '@/components/metadata-component/MetaData'

const OrderDetailPage = dynamic(() => import('@/components/pagecomponents/OrderDetailPage'), {
    ssr: false})

const index = () => {
    return (
        <div>
            <MetaData pageName="/order-detail/" title={`Order Details - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <OrderDetailPage />
        </div>
    )
}

export default index