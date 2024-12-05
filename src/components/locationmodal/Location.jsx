import React, { useState, useRef } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { t } from "@/utils/translation"
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { FaLocationCrosshairs } from 'react-icons/fa6'
import { StandaloneSearchBox, GoogleMap, MarkerF } from '@react-google-maps/api';
import * as api from "@/api/apiRoutes"
import { setSetting } from '@/redux/slices/settingSlice'
import { setCity } from '@/redux/slices/citySlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'

const Location = ({ showLocation, setShowLocation }) => {
    const setting = useSelector(state => state.Setting)
    const dispatch = useDispatch()
    const [mapView, setMapView] = useState(false)
    const [address, setAddress] = useState("")
    const [currLocationClick, setcurrLocationClick] = useState(false);
    const [isInputFields, setisInputFields] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false)
    const [loading, setLoading] = useState(false)

    const [localLocation, setlocalLocation] = useState({
        city: "",
        formatted_address: "",
        lat: parseFloat(23.022505),
        lng: parseFloat(72.5713621),
    });

    const inputRef = useRef();

    const center = {
        lat: localLocation.lat,
        lng: localLocation.lng,
        streetViewControl: false
    }


    const handleCloseLocation = () => {
        setShowLocation(false)
        setMapView(false)
    }

    const handleViewMap = () => {
        setMapView(true)
    }

    const getAvailableCity = async (response) => {
        var results = response.results;
        var c, lc, component;
        var found = false, message = "";
        for (var r = 0, rl = results.length; r < 2; r += 1) {
            var flag = false;
            var result = results[r];
            for (c = 0, lc = result.address_components.length; c < 2; c += 1) {
                component = result.address_components[c];
                const res = await api.getCity({ latitude: result.geometry.location.lat(), longitude: result.geometry.location.lng() })
                if (res.status === 1) {
                    flag = true;
                    found = true;
                    return res;
                }
                else {
                    // flag = true;
                    found = false;
                    message = res.message;
                }
                if (flag === true) {
                    break;
                }
            }
            if (flag === true) {
                break;
            }
        }
        if (found === false) {
            return {
                status: 0,
                message: message
            };
        }
    };
    const onMarkerDragStart = () => {
        setAddressLoading(true);
    };

    const handleDragEnd = async (e) => {
        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({
            location: {
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
            }
        }).then(async (res) => {
            if (res.results[0]) {
                const result = await getAvailableCity(res)
                if(result.status == 1){

                }else{
                    
                }
            } else {
            }
        }).catch((error) => {
            console.log("err", error)
        })


    }

    const handlePlaceChanged = async (e) => {
        const [place] = inputRef.current.getPlaces();
        try {
            if (place) {
                let city_name = place.address_components[0].long_name;
                let loc_lat = place.geometry.location.lat();
                let loc_lng = place.geometry.location.lng();
                let formatted_address = place.formatted_address;
                const response = await api.getCity({ latitude: loc_lat, longitude: loc_lng })
                if (response.status === 1) {
                    dispatch(setCity({
                        data: {
                            id: response.data.id,
                            name: city_name,
                            state: response.data.state,
                            formatted_address: formatted_address,
                            latitude: response.data.latitude,
                            longitude: response.data.longitude,
                            min_amount_for_free_delivery: response.data.min_amount_for_free_delivery,
                            delivery_charge_method: response.data.delivery_charge_method,
                            fixed_charge: response.data.fixed_charge,
                            per_km_charge: response.data.per_km_charge,
                            time_to_travel: response.data.time_to_travel,
                            max_deliverable_distance: response.data.max_deliverable_distance,
                            distance: response.data.distance
                        }
                    }));
                    const updatedSetting = {
                        ...setting?.setting,
                        default_city: {
                            id: response?.data?.id,
                            name: city_name,
                            state: response?.data?.name,
                            formatted_address: formatted_address,
                            latitude: response?.data?.latitude,
                            longitude: response?.data?.longitude
                        }
                    };
                    dispatch(setSetting({ data: updatedSetting }));
                    setLoading(false);
                    setShowLocation(false);
                    // props.bodyScroll(false);
                    // props.setisLocationPresent(true);
                    setShowLocation(false);
                } else if (response.status == 0) {
                    setLoading(false);
                    toast.error(t("We doesn't deliver at selected city"));
                    // props.setisLocationPresent(false);
                    setShowLocation(true);
                } else {
                    setLoading(false);
                    seterrorMsg(res.message);
                }
                // props.setisLocationPresent(true);
                // closeModalRef.current.click();
            } else {
                // toast.error("Location not found !");
                setShowLocation(true);
                setLoading(false);
            }
        } catch (e) {
            toast.error("Location not found!");
            console.log(e);
        }
        setLoading(false);
    }

    return (
        <>
            <Dialog open={showLocation} onOpenChange={handleCloseLocation}>
                <DialogContent>
                    <DialogHeader className="text-lg font-extrabold">{t("select_location")}</DialogHeader>
                    <div className='flex'>
                        {
                            !mapView ?
                                <div className='flex flex-col gap-3 w-full'>
                                    <div className='relative h-[100px]  m-8'>
                                        <Image src={setting?.setting?.web_settings?.web_logo} fill className=' object-contain' alt='logo' />
                                    </div>
                                    <h2 className=' text-center font-extrabold text-lg'>{t("select_delivery_location")}</h2>
                                    <button className='w-full m-auto rounded-lg primaryBorder p-1 font-medium flex items-center justify-center gap-1 mt-7' onClick={handleViewMap}><FaLocationCrosshairs /> {t("use_my_current_location")}</button>
                                    <div class="flex items-center justify-between my-4 gap-2">
                                        <hr class="flex-grow border-t-2 border-solid border-gray-300" />
                                        <span class=" text-[#4B6272] font-bold text-base">OR</span>
                                        <hr class="flex-grow border-t-2 border-solid border-gray-300" />
                                    </div>
                                    <form >
                                        <StandaloneSearchBox
                                            onLoad={ref => inputRef.current = ref}
                                            onPlacesChanged={handlePlaceChanged}
                                        >
                                            <input type="text" name="" id="" placeholder={t("select_delivery_location")} className='w-full p-2 buttonBackground outline-none rounded-lg text-sm placeholder:text-center'
                                                onFocus={() => {
                                                    setcurrLocationClick(false);
                                                    setisInputFields(true);
                                                }} onBlur={() => { setisInputFields(false); }}
                                            />
                                        </StandaloneSearchBox>
                                    </form>
                                </div>
                                :
                                <div className='flex flex-col gap-3 w-full'>
                                    <div className='w-full'>
                                        <GoogleMap streetViewControl={false} tilt={true} options={{
                                            streetViewControl: false
                                        }} zoom={11} center={center} mapContainerStyle={{ height: "400px" }}>
                                            <MarkerF position={center} draggable={true} onDragStart={onMarkerDragStart} onDragEnd={handleDragEnd} />
                                        </GoogleMap>
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                        <h2 className='text-center font-bold text-base'>address:</h2>
                                        <h2 className=''>Bhuj,Gujarat,India</h2>
                                    </div>
                                    <button className='w-full primaryBorder p-1 rounded-lg'>{t("confirm")}</button>
                                </div>

                        }
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Location