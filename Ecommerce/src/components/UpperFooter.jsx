import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { FaHeadphones } from "react-icons/fa";
import { BsFileLock2Fill } from "react-icons/bs";
import { GrDeliver } from "react-icons/gr";

export const UpperFooter = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center font-serif sm:px-[6%]  sm:py-10 mt-20 text-gray-200 py-4 bg-[#0b0e2c]">
      <div className="flex flex-col justify-center items-center content-center">
        <CiDeliveryTruck className="text-5xl text-red-500" />
        <p className="text-center">Free Delivery</p>
       
      </div>
      <div className="flex flex-col justify-center items-center content-center">
        <GrDeliver className="text-5xl text-red-500" />
        <p className="text-center">If goods have problems</p>
      </div>
      <div className="flex flex-col justify-center items-center content-center">
        <BsFileLock2Fill className="text-5xl text-red-500" />
        <p className="text-center">Secure Payment</p>
      </div>
      <div className="flex flex-col justify-center items-center content-center">
        <FaHeadphones  className="text-5xl text-red-500" />
        <p className="text-center">customer Support</p>
       
      </div>
    </div>
  );
};
