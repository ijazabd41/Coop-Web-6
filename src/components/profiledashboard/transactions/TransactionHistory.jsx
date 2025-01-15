import { t } from '@/utils/translation'
import React, { useEffect, useState } from 'react'
import TransactionCard from './TransactionCard'
import * as api from "@/api/apiRoutes"
import CardSkeleton from '@/components/skeleton/CardSkeleton'

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
                <div className='buttonBackground flex justify-between p-4 items-center'>
                    <h2 className='font-bold text-xl'>{t("transaction_history")}</h2>
                </div>
                <div className='grid grid-cols-12'>
                    {loading ?
                        Array?.from({ length: 6 })?.map((_, index) => {
                            return (
                                <CardSkeleton height={200} padding="2px" />
                            )
                        })
                        :
                        transaction?.map((transaction) => {
                            return (
                                <TransactionCard transaction={transaction} />
                            )
                        })
                    }

                </div>
            </div>
        </div>
    )
}

export default TransactionHistory