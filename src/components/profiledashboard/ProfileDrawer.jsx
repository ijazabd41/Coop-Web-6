import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { IoIosCloseCircle } from 'react-icons/io';
import { t } from '@/utils/translation';
import ProfileSidebar from './ProfileSidebar';

const ProfileDrawer = ({ showProfile, setShowProfile, selectedTab, setSelectedTab }) => {
    return (
        <Sheet open={showProfile} >
            <SheetContent className="p-0 w-full sm:w-[900px] ">
                <SheetHeader className="px-0 py-3 border-[1px] flex justify-between text-left">
                    <SheetTitle className="text-2xl font-bold flex flex-row items-center p-2 justify-between">
                        <p className='text-2xl font-bold'>{t("profile")}</p>
                        <div>
                            <IoIosCloseCircle size={32} onClick={() => setShowProfile(false)} />
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className='h-full overflow-scroll'>
                    <ProfileSidebar setSelectedTab={setSelectedTab} selectedTab={selectedTab} />
                </div>
            </SheetContent>

        </Sheet>
    )
}

export default ProfileDrawer