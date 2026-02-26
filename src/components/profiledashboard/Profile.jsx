import React, { useState, useEffect, use } from "react";
import { t } from "@/utils/translation";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { setCurrentUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s]+$/.test(name))
    return t("name_can_contain_only_letters_and_spaces");
  return "";
};

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return t("enter_a_valid_email_address");
  return "";
};

const validateMobile = (mobile) => {
  if (!mobile.trim()) return "Mobile number is required";
  if (!/^[0-9]{6,16}$/.test(mobile))
    return t("enter_a_valid_mobile_number_with_at_least_6_digits");
  return "";
};

const validateImage = (file) => {
  if (!file) return "";
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type))
    return t("only_jpg_or_png_images_are_allowed");
};

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User.user);
  const authType = useSelector((state) => state.User.authType);

  const [username, setUsername] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [mobileNumber, setMobileNumber] = useState(user?.mobile);
  const [profileImage, setProfileImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUsername(user?.name);
    setEmail(user?.email);
    setMobileNumber(user?.mobile);
  }, []);

  useEffect(() => {
    checkIfChecked();
  }, [username, email, mobileNumber, profileImage]);

  const onImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const checkIfChecked = () => {
    if (
      username !== user?.name ||
      email !== user?.email ||
      mobileNumber !== user?.mobile ||
      !user?.profileImage
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(username),
      email:
        authType === "google" || authType === "email"
          ? ""
          : validateEmail(email),
      mobile: authType === "phone" ? "" : validateMobile(mobileNumber),
      image: validateImage(profileImage),
    };

    Object.keys(newErrors).forEach(
      (key) => !newErrors[key] && delete newErrors[key],
    );

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);

      Object.values(newErrors).forEach((error) => {
        toast.error(error, {
          toastId: error,
        });
      });

      return;
    }

    setErrors({});
    try {
      const response = await api.updateProfile({
        name: username,
        email: email,
        mobileNumber: mobileNumber,
        image: profileImage,
        type: authType,
      });
      if (response?.status == 1) {
        const user = await api.getUser();
        dispatch(setCurrentUser({ data: user?.user }));
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(("Error", error));
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full mx-auto h-fit border-2 rounded-lg">
      <div className="w-full backgroundColor">
        <h2 className="text-2xl font-semibold  p-4">{t("editProfile")}</h2>
      </div>
      <div className="items-center  flex flex-col">
        <form
          className="w-full  justify-center items-center flex flex-col"
          onSubmit={handleProfileUpdate}
        >
          <div className="flex flex-col w-[90%] md:w-1/2 pt-[48px] pb-[48px] gap-[48px]">
            <div className="flex justify-center ">
              <div className="relative">
                <div className="relative w-36 h-36  rounded-md flex items-center justify-center overflow-hidden">
                  <Image
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : user?.profile
                    }
                    alt="profile image"
                    fill
                    className="h-full w-full object-cover rounded-md"
                    sizes="148px"
                  />
                </div>
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
                  accept="image/png, image/jpeg"
                  onChange={onImageChange}
                />
              </div>
            </div>
            <div>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium ">
                  {t("name")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  className="mt-1 block w-full rounded-md cardBorder py-2 px-4 disabled:text-gray-400"
                  defaultValue={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                // NOTE: remove due to tester suggestion in 2.0.4 update
                // disabled={authType == "google"}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium ">
                  {t("email")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full rounded-md cardBorder py-2 px-4 disabled:text-gray-400"
                  defaultValue={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={authType == "google" || authType == "email"}
                />
              </div>

              <div className="mb-4">
                <label htmlFor="mobile" className="block text-sm font-medium ">
                  {t("mobileNumber")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter your mobile number"
                  className="mt-1 block w-full rounded-md cardBorder py-2 px-4 disabled:text-gray-400"
                  defaultValue={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  disabled={authType == "phone"}
                />
              </div>
            </div>
          </div>

          <div className="p-4 topBorder flex justify-end w-full">
            <button
              type="submit"
              className="w-40 bg-[#29363f]  text-white py-2 px-4 rounded-md "
              disabled={isChanged == false}
            >
              {t("editProfile")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
