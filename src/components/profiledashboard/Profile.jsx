import React from 'react'
import { FiEdit } from "react-icons/fi";
const Profile = () => {
    return (
        <div className="w-full mx-auto h-fit border-2   rounded-lg   ">
            {/* Header */}
            <div className='w-full buttonBackground'>

                <h2 className="text-2xl font-semibold  p-4">Edit Profile</h2>
            </div>

            <div className='  items-center flex  flex-col py-12'>
                <div className='w-1/2'>
                    <div className="flex justify-center ">
                        <div className="relative">
                            <div className="w-24 h-24 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                                {/* Placeholder for Profile Image */}
                                <span className="text-gray-400 text-sm">Profile</span>
                            </div>
                            {/* Edit Icon */}
                            <label
                                htmlFor="profileImage"
                                className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer text-white"
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
                                className="block text-sm font-medium text-gray-700"
                            >
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                                defaultValue="Divy Jani"
                            />
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                                defaultValue="eGrocerSeller@gmail.com"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div className="mb-4">
                            <label
                                htmlFor="mobile"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                placeholder="Enter your mobile number"
                                className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                                defaultValue="0987654321"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end w-full">
                            <button
                                type="submit"
                                className="w-40 bg-[#141A1F]  text-white py-2 px-4 rounded-md  "
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