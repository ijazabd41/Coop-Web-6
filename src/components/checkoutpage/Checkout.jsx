import React, { useEffect, useState } from 'react'
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
import { useDispatch, useSelector } from 'react-redux'
import NewAddressModal from '../newaddressmodal/NewAddressModal'
import * as api from "@/api/apiRoutes"
import { setAllAddresses, setSelectedAddress } from '@/redux/slices/addressSlice'
import { toast } from 'react-toastify'

const Checkout = () => {

    const dispatch = useDispatch();
    const city = useSelector(state => state.City.city);
    const cart = useSelector(state => state.Cart);
    const address = useSelector((state) => state.Addresses);

    const [currentStep, setCurrentStep] = useState(3);
    const [couponseCodeId, setCouponCodeId] = useState(null);
    // step 1 variables
    const [isAddressSelected, setIsAddressSelected] = useState(false)
    const [showAddAddres, setShowAddAddres] = useState(false)
    // step 2 Variables
    const [selectedDate, setSelectedDate] = useState(null)
    const [timeSlots, setTimeSlots] = useState(null)
    const [availabeleTimeSlot, setAvailableTimeSlot] = useState([])
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
    const [orderNote, setOrderNote] = useState("");
    // step 3 variables
    const [checkoutData, setCheckoutData] = useState(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
    const [isWalletChecked, setIsWalletChecked] = useState(0);




    useEffect(() => {
        fetchAddress()
        handleFetchTimeSlots()

        // handleSelectAddress();
    }, [])

    useEffect(() => {
        handleFetchCheckout();
    }, [cart?.promo_code])

    const handleFetchCheckout = async () => {
        const couponseCodeId = cart?.promo_code?.promo_code_id;

        try {
            const response = await api.getCart({ latitude: city?.latitude, longitude: city?.longitude, checkout: 1, promocode_id: couponseCodeId });
            console.log("response", response?.data)
            if (response?.status == 1) {
                setCheckoutData(response?.data)
            }
        } catch (error) {
            console.log("Error", error)
        }
    }


    const handleSelectedDate = (date) => {
        const currentDate = new Date();
        const finalDate = currentDate.setHours(0, 0, 0, 0)
        if (date < finalDate) {
            toast.info("Please select a valid date")
        }
        setSelectedDate(date)
    }
    const formatDate = (date) => {
        if (!date) return t("choose_date");
        return new Date(date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    // const handleSelectAddress = () => {
    //     if (address?.selectedAddress.length == 0) {
    //         const defaultAddress = address?.allAddresses.find((address) => address.is_default == 1)
    //         dispatch(setSelectedAddress({ data: defaultAddress }))
    //     }
    // }

    const fetchAddress = async () => {
        try {
            const response = await api.getAddress();
            if (response.status == 1) {
                dispatch(setAllAddresses({ data: response.data }))
            }
        } catch (error) {
            console.log("Error", error)
        }
    }

    const handleFetchTimeSlots = async () => {
        try {
            const response = await api.getTimeSlots();
            setTimeSlots(response?.data);
            const availableTimeSlots = response?.data?.time_slots || [];
            const currentUtcTime = new Date();
            const updatedTimeSlots = availableTimeSlots.map((slot) => {
                const lastOrderTime = new Date();
                const [hours, minutes, seconds] = slot.last_order_time.split(":").map(Number);
                lastOrderTime.setHours(hours, minutes, seconds);
                const isDisabled = currentUtcTime >= lastOrderTime;
                return {
                    ...slot,
                    isDisabled,
                };
            });
            setAvailableTimeSlot({
                ...response?.data,
                time_slots: updatedTimeSlots,
            });
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handleTimeSlotChange = (value) => {
        setSelectedTimeSlot(value)
    }

    const handleChangeOrderNote = (e) => {
        setOrderNote(e.target.value)
    }

    const handleShowAddress = () => {
        setIsAddressSelected(false)
        setShowAddAddres(true)
    }

    const handleFirstStep = () => {
        if (address?.selectedAddress.length == 0) {
            const defaultAddress = address?.allAddresses.find((address) => address.is_default == 1)
            dispatch(setSelectedAddress({ data: defaultAddress }))
            setCurrentStep(2)
        } else {

            setCurrentStep(2)
        }
    }

    const handleSecondStep = () => {
        if (selectedDate == null) {
            toast.error(t("please_select_date"))
            return
        } else if (timeSlots?.time_slots_is_enabled == "true" && selectedTimeSlot == null) {
            toast.error(t("please_select_time_slot"))
            return
        }

        setCurrentStep(3)
    }

    const formatDateToDDMMYYYY = (date) => {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatDateWithTimeSlot = (date, timeSlot) => {
        const formattedDate = formatDateToDDMMYYYY(date);
        return timeSlot ? `${formattedDate} ${timeSlot.title}` : formattedDate;
    };

    const handlePlaceOrder = async () => {
        const formatDate = formatDateWithTimeSlot(selectedDate, selectedTimeSlot);
        console.log("formate date", formatDate)
        // try {
        //     if (selectedPaymentMethod == null) {
        //         toast.error("Please select payment method")
        //         return
        //     } else if (selectedDate == null) {
        //         toast.error("Please select date")
        //         return
        //     } else if (address.selectedAddress == null) {
        //         toast.error("Please select address")
        //         return
        //     } else {
        //         const response = await api.placeOrder({
        //             productVariantId: cart?.product_variant_id,
        //             quantity: cart?.quantity,
        //             total: checkoutData?.sub_total,
        //             deliveryCharge: checkoutData?.delivery_charge?.total_delivery_charge,
        //             final_total: checkoutData?.total_amount,
        //             wallet_used: isWalletChecked,
        //             address_id: address?.selectedAddress?.id,

        //             delivery_date: selectedDate,
        //             time_slot_id: selectedTimeSlot?.id,
        //             order_note: orderNote,
        //             payment_method: selectedPaymentMethod,
        //             promocode_id: cart?.promo_code?.promo_code_id,
        //             use_wallet: isWalletChecked ? 1 : 0,
        //         });
        //         if (response.status == 1) {
        //             toast.success(response.message)
        //         }
        //     }

        // } catch (error) {
        //     console.log("Error", error)
        // }
    }

    return (
        <section>
            <BreadCrumb />
            <div className='container px-2'>
                <div className='flex justify-center flex-col items-center'>
                    <div className='flex w-full lg:w-1/2'>
                        <Stepper currentStep={currentStep} />
                    </div>
                    <div className='w-full '>
                        {/* step 1 */}
                        {
                            currentStep == 1 &&
                            <div className='flex flex-col cardBorder rounded-sm mb-4'>
                                <div className='flex  justify-between backgroundColor py-4 px-2 '>
                                    <span className='font-bold text-base md:text-xl'>{t("choose_delivery_address")}</span>
                                    <button className='flex  items-center text-sm' onClick={handleShowAddress}><GoPlus />{t("add_address")}</button>
                                </div>
                                <div className='flex flex-col overflow-y-auto h-96'>
                                    {address?.allAddresses?.map((address) => {
                                        return (
                                            <div>  <AddressCard address={address} setShowAddAddres={setShowAddAddres} setIsAddressSelected={setIsAddressSelected} fetchAddress={fetchAddress} /></div>
                                        )
                                    })}
                                </div>
                                <div className='flex justify-end m-4'>
                                    <button onClick={handleFirstStep} className='text-white primaryBackColor px-4 py-2 rounded-sm text-xl font-normal' >{t("continue")}</button>
                                </div>
                            </div>
                        }
                        {/* step 2 */}
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
                                                <PopoverContent className="w-full p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={selectedDate}
                                                        onSelect={handleSelectedDate}
                                                        className="rounded-md w-full"
                                                        fromDate={new Date()}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        {timeSlots?.time_slots_is_enabled == "true" && <div className='col-span-12 md:col-span-6  flex flex-col gap-1'>
                                            <span className='text-base font-bold '>{t("preferred_delivery_time")}</span>
                                            <Select onValueChange={handleTimeSlotChange}>
                                                <SelectTrigger className="w-full py-5 cardBorder">
                                                    <SelectValue placeholder="Select a timezone " />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availabeleTimeSlot?.time_slots?.map((slot) => {
                                                        return (
                                                            <div key={slot?.id}>
                                                                <SelectItem disabled={slot?.isDisabled} value={slot} onClick={() => { selectTimeZone(slot) }}>{slot?.title}
                                                                </SelectItem>
                                                            </div>
                                                        )
                                                    })}

                                                </SelectContent>
                                            </Select>
                                        </div>}

                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-base font-bold '>{t("order_note_title")}</span>
                                        <textarea name="" id="" className='cardBorder rounded-sm w-full p-2 outline-none' value={orderNote} onChange={(e) => handleChangeOrderNote(e)} placeholder={t("order_note")}></textarea>
                                    </div>

                                    <div className='flex justify-end gap-4'>
                                        <button className='cardBorder px-4 py-2 rounded-sm text-xl font-normal' onClick={() => setCurrentStep(1)}>{t("previous")}</button>
                                        <button className='text-white primaryBackColor px-4 py-2 rounded-sm text-xl font-normal' onClick={handleSecondStep}>{t("continue")}</button>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* step 3 */}
                        {
                            currentStep == 3 &&
                            <div className='grid grid-cols-12  gap-2 md:gap-6'>
                                <div className='md:col-span-8 lg:col-span-9 col-span-12'>
                                    <CheckoutPayment checkout={checkoutData} selectedPaymentMethod={selectedPaymentMethod} setSelectedPaymentMethod={setSelectedPaymentMethod} setCurrentStep={setCurrentStep} />
                                </div>
                                <div className=' md:col-span-4 lg:col-span-3 col-span-12'>
                                    <OrderSummaryCard checkout={checkoutData} handlePlaceOrder={handlePlaceOrder}/>
                                </div>

                            </div>
                        }
                    </div>
                </div>
            </div>
            <NewAddressModal fetchAddress={fetchAddress} showAddAddres={showAddAddres} setShowAddAddres={setShowAddAddres} isAddressSelected={isAddressSelected} />
        </section>
    )
}

export default Checkout