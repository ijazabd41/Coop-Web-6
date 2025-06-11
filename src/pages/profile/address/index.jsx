import React from 'react'

const AddressPage = dynamic(()=>import('@/components/metadata-component/MetaData'),{ssr:false})
import dynamic from 'next/dynamic'
import MetaData from '@/components/metadata-component/MetaData'
const Address = () => {
    return (
        <div>
            <MetaData pageName="/profile/address" title={`Address - ${process.env.NEXT_PUBLIC_META_TITLE}`} />
            <AddressPage />
        </div>
    )
}

export default Address