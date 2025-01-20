import { t } from '@/utils/translation'
import React, { useEffect, useState } from 'react'
import TransactionCard from './TransactionCard'
import * as api from "@/api/apiRoutes"
import CardSkeleton from '@/components/skeleton/CardSkeleton'
import NoTransactionImage from "@/assets/not_found_images/No_Transaction.svg"
import Image from 'next/image'

const TransactionHistory = () => {

    const [transaction, setTransaction] = useState([])
    const [offset, setOffset] = useState(0)
    const [total, setTotal] = useState(null)
    const [loading, setLoading] = useState(false)

    const transactionPerPage = 10;
    useEffect(() => {
        handleFetchTransactions();
    }, [offset])

    const handleFetchTransactions = async () => {
        setLoading(true)
        try {
            const response = await api.getUserTransactions({ limit: transactionPerPage, offset: offset, type: "transactions" })
            if (response.status == 1) {
                setTransaction(response.data)
                setTotal(response.total)
                setLoading(false)
                console.log("response", response?.data)
            } else {
                setLoading(false)
                console.log("Error", response.message)
            }
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }

    const handleFetchMore = () => {
        setOffset(offset => offset + transactionPerPage)
    }

    return (
        <div>
            <div className='w-full cardBorder rounded-sm '>
                <div className='backgroundColor flex justify-between p-4 items-center'>
                    <h2 className='font-bold text-xl'>{t("transaction_history")}</h2>
                </div>
                <div className='grid grid-cols-12'>
                    {loading ?
                        Array?.from({ length: 6 })?.map((_, index) => {
                            return (
                                <div className='col-span-12  md:col-span-6 lg:col-span-4' key={index}>
                                    <CardSkeleton height={200} padding="2px" key={index} />
                                </div>
                            )
                        })
                        : transaction?.length > 0 ?
                            transaction?.map((transaction) => {
                                return (
                                    <TransactionCard transaction={transaction} key={transaction?.id} />
                                )
                            }) : <div className=' col-span-12 h-full w-full flex items-center justify-center flex-col gap-2 p-2'>
                                <Image src={NoTransactionImage} alt='Transactions Not found' height={0} width={0} className='h-3/4 w-3/4' />
                                <h2 className='text-2xl font-bold'>{t("no_transaction")}</h2>
                            </div>
                    }

                </div>
            </div>
        </div>
    )
}

export default TransactionHistory