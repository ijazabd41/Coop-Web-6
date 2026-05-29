import React from 'react'
import MetaData from '@/components/metadata-component/MetaData'
import dynamic from 'next/dynamic'

const LoyaltyPage = dynamic(()=>import('@/components/pagecomponents/LoyaltyPage'),{ssr:false})

const index = () => {
    return (
        <div>
            <MetaData pageName="/profile/loyalty" title={`Loyalty Program - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <LoyaltyPage />
        </div>
    )
}

export default index
