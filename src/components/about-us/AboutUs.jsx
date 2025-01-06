import React from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import { useSelector } from "react-redux";

const AboutUs = () => {
  const setting = useSelector((state) => state?.Setting?.setting);
  console.log(setting?.about);
  return (
    <section>
      <div>
        <div>
          <BreadCrumb />
        </div>
        <div className="container my-5 w-full mx-auto h-max py-0 lg:w-[920px] bodyBackgroundColor px-4 ">
          <div className=" flex flex-col gap-4 rounded p-4 items-center backgroundColor infoContent "
            dangerouslySetInnerHTML={{
              __html: setting?.about_us,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
