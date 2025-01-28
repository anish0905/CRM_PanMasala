import React, { useState } from "react";
import { MdSms } from "react-icons/md";

const SMSDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative">
            <div className="relative">
                <button
                    onClick={toggleDrawer}
                    className="right-4 text-gray-600 px-4 py-2 rounded cursor-pointer"
                >
                    <MdSms className="lg:text-5xl  text-4xl" />
                </button>
                <span className="absolute top-0 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    1
                </span>
            </div>


            <div
                className={`fixed top-0 right-0 z-50 h-full lg:w-1/4 md:w-1/4 w-1/2 bg-white shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full p-4">
                    <h2 className="text-xl font-semibold mb-4">Drawer Content</h2>
                    <p>Add your content here.</p>
                    <button
                        onClick={toggleDrawer}
                        className="mt-auto bg-gray-300 px-4 py-2 rounded"
                    >
                        Close Drawer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SMSDrawer;
