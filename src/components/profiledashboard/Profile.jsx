import { t } from '@/utils/translation';
import Image from 'next/image';
import React from 'react'
import { FiEdit } from "react-icons/fi";
import { useSelector } from 'react-redux';
const Profile = () => {

    const user = useSelector(state => state.User.user)
    return (
        <div className="w-full mx-auto h-fit border-2   rounded-lg   ">
            {/* Header */}
            <div className='w-full buttonBackground'>

                <h2 className="text-2xl font-semibold  p-4">{t("editProfile")}</h2>
            </div>

            <div className='  items-center flex  flex-col py-12'>
                <div className='w-1/2'>
                    <div className="flex justify-center ">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                {/* Placeholder for Profile Image */}
                                <Image src={user?.profile} alt='profile image' height={0} width={0} className='h-full w-full' />
                            </div>
                            {/* Edit Icon */}
                            <label
                                htmlFor="profileImage"
                                className="absolute bottom-0 right-0 backPrimary primaryBackColor p-2 rounded-full cursor-pointer text-white"
                            >
                                <FiEdit className="text-lg" />
                            </label>
                            <input
                                type="file"
                                id="profileImage"
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <form>
                        {/* Name */}
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium "
                            >
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                                defaultValue={user?.name}
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium "
                            >
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                                defaultValue={user?.email}
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-4">
                            <label
                                htmlFor="mobile"
                                className="block text-sm font-medium "
                            >
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                placeholder="Enter your mobile number"
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                                defaultValue={user?.mobile}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end w-full">
                            <button
                                type="submit"
                                className="w-40 bg-[#29363f]  text-white py-2 px-4 rounded-md  "
                            >
                                Update Profile
                            </button>
                        </div>
                    </form>
                </div>

            </div>

        </div>
    )
}

export default Profile