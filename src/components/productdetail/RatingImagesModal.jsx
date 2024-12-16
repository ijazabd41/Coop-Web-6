import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image'
import RatingLightBox from './RatingLightBox';
import { t } from '@/utils/translation';

const RatingImagesModal = ({ showImagesModal, setShowImagesModal, images }) => {

    const [showLightBox, setShowLightbox] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    const [lightBoxImages, setLightBoxImages] = useState([])

    const handleLightBox = (index) => {
        const ratingImages = images?.map((img) => ({ src: img?.src ? img?.src : img }))
        setLightBoxImages(ratingImages)
        setImageIndex(index)
        setShowLightbox(true)
    }

    return (
        <div>
            <Dialog open={showImagesModal} onOpenChange={setShowImagesModal}>

                <DialogContent>
                    <DialogHeader>
                        <h1 className='font-bold text-2xl'>{t("Rating_images")}</h1>
                    </DialogHeader>
                    <div className='flex flex-wrap gap-2 justify-center'>
                        {images?.map((image, index) => {
                            return (
                                <div className="relative w-24 h-24 rounded overflow-hidden" key={index}>
                                    <Image
                                        src={image}
                                        alt="Rating image"
                                        height={0}
                                        width={0}
                                        className="h-full w-full"
                                        onClick={() => handleLightBox(index)}
                                    /></div>
                            )
                        })}
                    </div>
                </DialogContent>
            </Dialog>
            <RatingLightBox showLightBox={showLightBox} setShowLightbox={setShowLightbox} images={lightBoxImages} imageIndex={imageIndex} />
        </div>
    )
}


export default RatingImagesModal