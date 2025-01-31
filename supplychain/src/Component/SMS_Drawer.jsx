import React, { useState } from "react";
import { MdSms, MdNotifications, MdHistory, MdClose } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

const SMSDrawer = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState(null);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    const toggleTooltip = (id) => {
        if (window.innerWidth <= 768) {  // Only toggle on small screens
            setActiveTooltip(activeTooltip === id ? null : id);
        }
    };

    return (
        <div className="relative">
            {/* Floating SMS Icon Button */}
            <button
                onClick={toggleDrawer}
                className="fixed bottom-6 right-6 bg-teal-900 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all sm:bottom-4 sm:right-4"
            >
                <MdSms className="text-4xl sm:text-3xl" />
            </button>

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full p-4 sm:p-6 bg-gray-100 rounded-l-lg">
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Messages</h2>
                        <button onClick={toggleDrawer} className="text-gray-600 hover:text-red-500 transition">
                            <MdClose className="text-2xl sm:text-3xl" />
                        </button>
                    </div>
                    <nav>
                        <ul className="list-none flex space-x-6 sm:space-x-8 justify-center">
                            {[
                                { name: "Notifications", icon: <MdNotifications />, id: "notifications" },
                                { name: "Approval Request", icon: <VscGitPullRequestGoToChanges />, id: "approval" },
                                { name: "History", icon: <MdHistory />, id: "history" }
                            ].map((item) => (
                                <li key={item.id} className="relative">
                                    <span
                                        className="text-gray-600 text-4xl sm:text-3xl cursor-pointer hover:text-blue-500 transition relative"
                                        onMouseEnter={() => window.innerWidth > 768 && setActiveTooltip(item.id)}
                                        onMouseLeave={() => window.innerWidth > 768 && setActiveTooltip(null)}
                                        onClick={() => toggleTooltip(item.id)}
                                    >
                                        {item.icon}
                                        {(activeTooltip === item.id) && (
                                            <span className="absolute left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-md whitespace-nowrap">
                                                {item.name}
                                            </span>
                                        )}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button
                        onClick={toggleDrawer}
                        className="mt-auto bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all shadow-md"
                    >
                        Close Drawer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SMSDrawer;
