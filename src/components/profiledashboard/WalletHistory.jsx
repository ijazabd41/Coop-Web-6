import React from 'react'

const WalletHistory = () => {
    return (
        <div>
            <div className='w-full cardBorder rounded-sm '>
                <div className='buttonBackground flex justify-between p-4 items-center'>
                    <h2 className='font-bold text-xl'>{t("wallet_history")}</h2>
                </div>
                <div>
                    <div className='grid grid-cols-12 '>
                        <div className='col-span-6'></div>
                        <div className='col-span-6'></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletHistory