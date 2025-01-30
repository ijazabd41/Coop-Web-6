import React from 'react'
import MaitanceImage from "@/assets/under_maintenance.svg"
import Image from 'next/image'

const MaintanceMode = ({ message }) => {
    return (
        <section>
            <div className='container'>
                <div className='w-1/2 flex items-center justify-center flex-col my-10'>
                    <div className='h-full w-full'>
                        <Image src={MaitanceImage} alt='Maintance Mode image' height={0} width={0} className='h-full w-full' />
                    </div>
                    <h1>Maintance mode on</h1>
                    <button>Home</button>
                </div>
            </div>
        </section>
    )
}

export default MaintanceMode