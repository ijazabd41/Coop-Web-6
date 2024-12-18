import React, { useState } from 'react'
import BreadCrumb from '../breadcrumb/BreadCrumb'
import Stepper from './Stepper'
import AddressCard from '../cards/AddressCard'
import { t } from "@/utils/translation"
import { GoPlus } from "react-icons/go";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { FaRegCalendarAlt } from 'react-icons/fa'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CheckoutPayment from './CheckoutPayment'
import OrderSummaryCard from './OrderSummaryCard'

const Checkout = () => {
    const [currentStep, setCurrentStep] = useState(3);
    const [selectedAddess, setSelectedAddress] = useState('')
    const [selectedDate, setSelectedDate] = useState("")
    const [selectedTime, setSelectedTime] = useState("")

    const handleSelectedDate = (date) => {
        setSelectedDate(date)
    }
    const formatDate = (date) => {
        if (!date) return t("choose_date"); // Default placeholder text
        return new Date(date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <section>
            <BreadCrumb />
            <div className='container px-2'>
                <div className='flex justify-center flex-col items-center'>
                    <div className='flex w-full lg:w-1/2'>
                        <Stepper currentStep={currentStep} />
                    </div>
                    <div className='w-full '>
                        {
                            currentStep == 1 &&
                            <div className='flex flex-col cardBorder rounded-sm mb-4'>
                                <div className='flex  justify-between backgroundColor py-4 px-2 '>
                                    <span className='font-bold text-base md:text-xl'>{t("choose_delivery_address")}</span>
                                    <button className='flex  items-center text-sm'><GoPlus />{t("add_address")}</button>
                                </div>
                                <div className='flex flex-col overflow-scroll h-96'>
                                    <AddressCard />
                                </div>
                                <div className='flex justify-end m-4'>
                                    <button className='text-white primaryBackColor px-4 py-2 rounded-sm text-xl font-normal'>{t("continue")}</button>
                                </div>
                            </div>
                        }
                        {
                            currentStep == 2 &&
                            <div className='flex flex-col cardBorder rounded-sm mb-4 w-full'>
                                <div className='flex  justify-between backgroundColor p-4'>
                                    <span className='font-bold text-xl'>{t("preferred_day_and_time")}</span>
                                </div>
                                <div className="flex flex-col p-4 gap-6">
                                    <div className='grid grid-cols-12 items-center gap-4'>
                                        <div className='col-span-12  md:col-span-6 flex flex-col gap-1 '>
                                            <span className='text-base font-bold'>{t("preferred_delivery_day")}</span>
                                            <Popover>
                                                <PopoverTrigger className='cardBorder w-full  px-4 py-2 rounded-sm items-center flex justify-between '>{formatDate(selectedDate)}<FaRegCalendarAlt /></PopoverTrigger>
                                                <PopoverContent className="w-full p-0"> <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={handleSelectedDate}
                                                    className="rounded-md w-full"
                                                /></PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className='col-span-12 md:col-span-6  flex flex-col gap-1'>
                                            <span className='text-base font-bold '>{t("preferred_delivery_time")}</span>
                                            <Select>
                                                <SelectTrigger className="w-full py-5 cardBorder">
                                                    <SelectValue placeholder="Select a timezone " />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                                    <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                                    <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                                    <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                                    <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                                    <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-base font-bold '>{t("order_note_title")}</span>
                                        <textarea name="" id="" className='cardBorder rounded-sm w-full p-2 outline-none' placeholder={t("order_note")}></textarea>
                                    </div>

                                    <div className='flex justify-end gap-4'>
                                        <button className='cardBorder px-4 py-2 rounded-sm text-xl font-normal'>{t("previous")}</button>
                                        <button className='text-white primaryBackColor px-4 py-2 rounded-sm text-xl font-normal'>{t("continue")}</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            currentStep == 3 &&
                            <div className='grid grid-cols-12  gap-2 md:gap-6'>
                                <div className='md:col-span-8 lg:col-span-9 col-span-12'>
                                    <CheckoutPayment />
                                </div>
                                <div className=' md:col-span-4 lg:col-span-3 col-span-12'>
                                    <OrderSummaryCard />
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Checkout