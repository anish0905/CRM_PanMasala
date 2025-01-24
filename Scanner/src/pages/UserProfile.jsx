import React, { useEffect, useState } from "react";
import axios from "axios";
import EditModal from "../component/utils/EditModal";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdPrint } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const user = localStorage.getItem("user_id");
  const navigate = useNavigate();

  const API_URL= process.env.REACT_APP_API_URL;

  const navigateToRegister = () => {
    navigate("/register");
  };

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/panShopOwner/${user}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.qrCodeBase64);
      if (response.data.qrCodeBase64) {
        setUserData(response.data);
        console.log("Owner user", response.data.owner.user_id);
      } else {
        console.error("QR Code Base64 string not found in response.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error state or notification here
    }
  };

  const handlePrint = () => {
    if (userData && userData.qrCodeBase64) {
      const qrImage = `data:image/png;base64,${userData.qrCodeBase64}`;
      const printWindow = window.open("", "_blank");
      printWindow.document.open();
      printWindow.document.write(`<img src="${qrImage}" />`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center w-full h-full place-items-center">
        <div className="flex flex-col  bg-blue-800 lg:w-1/4 md:w-1/4 w-full h-full content-center p-10 place-items-center ">
          <div className="flex justify-between align-middle w-full lg:text-3xl md:text-2xl text-2xl">
            <FaArrowLeftLong
              className="text-[#c8c6ca] cursor-pointer"
              onClick={navigateToRegister}
            />
            <p className=" text-[#c8c6ca] text-center px-8 py-0 mb-6">
              Scan QR Code
            </p>
            <MdPrint
              className="text-[#c8c6ca] cursor-pointer"
              onClick={handlePrint}
            />
          </div>
          <div className="w-full h-full flex justify-center items-center content-center p-10">
            <div className="bg-white lg:h-60 lg:w-60 h-60 w-60 pt-4 sm:m-0 rounded-lg">
              <div className="object-cover flex justify-center items-center content-center">
                {userData && userData.qrCodeBase64 && (
                  <img
                    src={`data:image/png;base64,${userData.qrCodeBase64}`}
                    alt="QR Code "
                  />
                )}
              </div>
              <div className="flex justify-center items-center ">
                <p className="text-sm">{user}</p>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center content-center">
            <div className="flex justify-center items-center content-center bg-white shadow-lg rounded-lg w-96">
              {userData ? (
                <div className="px-5 py-8 text-sm">
                  <p className="my-2 font-bold">
                    PAN Shop Owner Name:{" "}
                    <span className="font-light">
                      {userData.owner.panShopOwner}
                    </span>
                  </p>
                  <p className="my-2 font-bold">
                    Phone:{" "}
                    <span className="font-light">
                      {userData.owner.phoneNumber}
                    </span>
                  </p>
                  <p className="my-2 font-bold">
                    Address:{" "}
                    <span className="font-light">{userData.owner.address}</span>{" "}
                  </p>
                  <div className="flex justify-center items-center content-center mt-5">
                    <EditModal
                      className="sm:mt-8 pt-5 rounded-full"
                      user={userData.owner}
                      setUserData={setUserData}
                    />
                  </div>
                </div>
              ) : (
                <p>Loading user data...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
