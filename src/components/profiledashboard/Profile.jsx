import React, { useState, useEffect, use } from "react";
import { t } from "@/utils/translation";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { setCurrentUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 250;
        const MAX_HEIGHT = 250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
        resolve(dataUrl.split(",")[1]);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (error) => reject(error);
  });

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
  const [countryCode, setCountryCode] = useState(user?.country_code || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in");
  const [profileImage, setProfileImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState({});

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toast.error(t("password_required") || "Password is required");
      return;
    }
    if (newPassword.length < 6) {
      toast.error(t("password_length") || "Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("passwords_do_not_match") || "Passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const response = await api.updateUserPassword({
        password: newPassword,
      });
      if (response?.status == 1) {
        toast.success(response.message || t("password_updated") || "Password updated successfully");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(response.message || t("password_update_failed") || "Failed to update password");
      }
    } catch (error) {
      console.log("Error", error);
      toast.error(t("something_went_wrong") || "Something went wrong");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  useEffect(() => {
    setUsername(user?.name);
    setEmail(user?.email);

    let initialMobile = user?.mobile || "";
    let initialCountryCode = (user?.country_code || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in").replace(/\+/g, "");

    if (initialMobile && initialCountryCode && initialMobile.startsWith(initialCountryCode)) {
      initialMobile = initialMobile.slice(initialCountryCode.length);
    }

    setMobileNumber(initialMobile);
    setCountryCode(initialCountryCode);
  }, []);

  useEffect(() => {
    checkIfChecked();
  }, [username, email, mobileNumber, countryCode, profileImage]);

  const onImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const checkIfChecked = () => {
    let initialMobile = user?.mobile || "";
    let initialCountryCode = (user?.country_code || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in").replace(/\+/g, "");

    if (initialMobile && initialCountryCode && initialMobile.startsWith(initialCountryCode)) {
      initialMobile = initialMobile.slice(initialCountryCode.length);
    }

    let currentCountryCode = countryCode ? countryCode.replace(/\+/g, "") : "";

    if (
      username !== user?.name ||
      email !== user?.email ||
      mobileNumber !== initialMobile ||
      currentCountryCode !== initialCountryCode ||
      !user?.profileImage
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handlePhoneNoChange = (value, data) => {
    const dialCode = data?.dialCode || "";
    const phoneWithoutDialCode = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;
    setMobileNumber(phoneWithoutDialCode);
    setCountryCode("+" + dialCode);
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
      let imageBase64 = undefined;
      if (profileImage && profileImage instanceof File) {
        imageBase64 = await fileToBase64(profileImage);
      }

      const response = await api.updateProfile({
        name: username,
        email: email,
        mobileNumber: mobileNumber,
        country_code: countryCode,
        image: imageBase64,
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
                <PhoneInput
                  country={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in"}
                  value={countryCode.replace("+", "") + mobileNumber}
                  onChange={(phone, data) => handlePhoneNoChange(phone, data)}
                  disabled={authType == "phone"}
                  inputProps={{
                    name: "mobile",
                    id: "mobile",
                    required: true,
                    placeholder: t("mobileNumber"),
                  }}
                  containerClass="mt-1"
                  inputStyle={{ width: "100%" }}
                  inputClass="!w-full !h-full !rounded-md !cardBorder !py-2 !pl-12 !pr-4 disabled:text-gray-400"
                  buttonClass="!rounded-l-md !cardBorder "
                />
              </div>
            </div>
          </div>

          <div className="p-4 topBorder flex justify-end w-full">
            <button
              type="submit"
              className="w-40 accentButtonBg  text-white py-2 px-4 rounded-md "
              disabled={isChanged == false}
            >
              {t("editProfile")}
            </button>
          </div>
        </form>

        {authType !== "google" && (
          <form
            className="w-full justify-center items-center flex flex-col border-t mt-4"
            onSubmit={handlePasswordUpdate}
          >
            <div className="flex flex-col w-[90%] md:w-1/2 pt-8 pb-8 gap-6">
              <h3 className="text-xl font-semibold">{t("update_password") || "Update Password"}</h3>
              <div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium">
                    {t("new_password") || "New Password"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder={t("enter_new_password") || "Enter new password"}
                    className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    {t("confirm_password") || "Confirm Password"} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder={t("confirm_new_password") || "Confirm new password"}
                    className="mt-1 block w-full rounded-md cardBorder py-2 px-4"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="p-4 topBorder flex justify-end w-full">
              <button
                type="submit"
                className="w-40 accentButtonBg text-white py-2 px-4 rounded-md disabled:opacity-50"
                disabled={!newPassword || isUpdatingPassword}
              >
                {isUpdatingPassword ? t("updating") || "Updating..." : t("update_password") || "Update Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
