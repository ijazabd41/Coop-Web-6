import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog"
import { t } from "@/utils/translation"
import { IoIosCloseCircle } from 'react-icons/io'
import { StandaloneSearchBox, GoogleMap, MarkerF } from '@react-google-maps/api';
import * as api from "@/api/apiRoutes"

const NewAddressModal = ({ showAddAddres, setShowAddAddres }) => {

    const [addressLoading, setAddressLoading] = useState("")
    const [errorMsg, seterrorMsg] = useState("")
    const [center, setCenter] = useState()

    const [localLocation, setlocalLocation] = useState({
        city: "",
        formatted_address: "",
        lat: parseFloat(0),
        lng: parseFloat(0),
    });

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            setlocalLocation({ lat: lat, lng: lng })
        });
    }, [showAddAddres])



    useEffect(() => {
        const center = {
            lat: localLocation.lat,
            lng: localLocation.lng,
            streetViewControl: false
        }
        setCenter(center)
    }, [localLocation.lat, localLocation.lng])


    const handleHideAddressModal = () => {
        setShowAddAddres(false)
    }

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
                if (result.status == 1) {
                    setlocalLocation({
                        formatted_address: result?.data?.formatted_address,
                        city: result?.data?.name,
                        lat: res.results[0].geometry.location.lat(),
                        lng: res.results[0].geometry.location.lng()
                    })
                    setAddressLoading(false);
                    seterrorMsg("");
                } else {
                    setlocalLocation({
                        city: null,
                        formatted_address: res.results[0].formatted_address,
                        lat: (res.results[0].geometry.location.lat()),
                        lng: (res.results[0].geometry.location.lng()),
                    });
                    setAddressLoading(false);
                    // setisloading(false);
                    seterrorMsg(res.message);
                }
            } else {
                toast.error("City not found")
            }
        }).catch((error) => {
            console.log("err", error)
        })
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

    const mapContainerStyle = {
        width: "100%",
        height: window.innerWidth > 990 ? "600px" : "400px"
    };

    return (
        <Dialog open={showAddAddres} >
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <div className='flex flex-row justify-between items-center'>
                        <h2 className='font-bold text-xl'>{t("new_address")}</h2>
                        <IoIosCloseCircle size={32} onClick={() => handleHideAddressModal()} />
                    </div>
                </DialogHeader>
                <div className='p-2'>
                    <div className='flex gap-2 flex-col md:flex-row'>
                        <div className='w-full md:w-1/2'>
                            <GoogleMap streetViewControl={false} tilt={true} options={{
                                streetViewControl: false
                            }} zoom={11} center={center} mapContainerStyle={mapContainerStyle} className="h-full">
                                <MarkerF position={center} draggable={true} onDragStart={onMarkerDragStart} onDragEnd={handleDragEnd} />
                            </GoogleMap>
                        </div>
                        <div>
                            <div className='flex flex-col'>
                                <div className='flex flex-col'>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default NewAddressModal