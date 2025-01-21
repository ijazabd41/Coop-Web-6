import React from 'react';
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import Image from 'next/image';

const HomePageLightbox = ({ showLightBox, setShowLightbox, image }) => {
    return (
        <div>
            <Dialog>
                <DialogContent >
                    <div className='bg-transparent'>
                        <div className='h-full w-full'>
                            <Image src={image} alt='Offer image' height={0} width={0} className='h-full w-full' />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default HomePageLightbox