import React, { useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import { t } from "@/utils/translation"
import Filter from '../productFilter/ProductFilter'
const Products = () => {

    const [productResult, setProductResult] = useState([])
    const [offset, setOffset] = useState(0)

    return (
        <section>
            <div >
                <div><BreadCrumb /></div>
                <div className='container'>
                    <div className='my-8 grid grid-cols-12 gap-6'>
                        <div className='cardBorder col-span-3 rounded-sm'>
                            <Filter setProductResult={setProductResult} setOffset={setOffset}/>
                            {/* <div className='flex justify-between items-center p-4 border-b-[1px]'>
                                <span className='text-xl font-bold'>{t("filter")}</span>
                                <span className='text-sm font-normal leading-4 text-[#DB3D26]'>{t("clearAll")}</span>
                            </div>
                            <div>
                                Categories
                            </div> */}
                        </div>
                        <div className='border-2 col-span-9'>Products</div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Products