import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { FaChevronRight } from 'react-icons/fa';

const BreadCrumb = () => {
    const router = useRouter();
    const [pathname, setPathname] = useState("")


    useEffect(() => {
        if (router.pathname) {
            const formatedPathName = router.pathname.split("/")[1]
            setPathname(formatedPathName)
        } else {
            setPathname("")
        }

    }, [])

    return (
        <section className='p-6 breadCrumbBg'>
            <div className='flex justify-between container'>
                <p className='text-xl font-bold capitalize'>{pathname}</p>
                <div className='flex gap-1 items-center'>
                    <div className='flex gap-1 items-center'>
                        <span className='text-sm font-normal'>Home</span>
                        <FaChevronRight size={14} />
                    </div>
                </div>
            </div>

        </section>
    )
}

export default BreadCrumb