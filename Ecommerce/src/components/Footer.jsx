import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsFacebook } from "react-icons/bs";
import { FaInstagram, FaSpotify } from "react-icons/fa";
import { FaTwitter, FaLinkedin } from "react-icons/fa";
import axios from "axios";

const LINKS = [
  {
    title: "Quick Links",
    items: [
      { name: "Products", path: "/products" },
      { name: "Gift Cards", path: "/giftCards" },
      { name: "Offers", path: "/offers" },
      { name: "Our Story", path: "/about" },
      { name: "Corporate Gifting", path: "/corporateGifting" },
    ],
  },
  {
    title: "Company",
    items: [
      { name: "BLOG", path: "/blogs" },
      { name: "Privacy Policy", path: "/privacyPolicy" },
      { name: "Contact Us", path: "/contactUs" },
      { name: "Media", path: "/media" },
      { name: "Terms of Use", path: "/termsOfUse" },
    ],
  },
];

const CONTACT_INFO = {
  title: "Contact us",
  details: {
    email: "support@atticapmasala.com",
    phone: "+91 12345 67890",
    address: [
      "Attica Pan Masala",
      "Karnataka, Tamil Nadu, Andhra Pradesh, Telangana, Pondicherry"
    ],
  },
};

const Footer = () => {
  const URI = import.meta.env.VITE_API_URL;
  const [logo, setLogo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from API
    const fetchNavbarData = async () => {
      try {
        const response = await axios.get(`${URI}api/navbarIcons/getAll`);
        if (response.data && response.data.length > 0) {
          const { filename } = response.data[0]; 
          setLogo(`${URI}uploads/${filename}`);
        }
      } catch (error) {
        console.error("Error fetching navbar data:", error);
      }
    };

    fetchNavbarData();
  }, [URI]);

  return (
    <footer className="text-gray-300 py-8 font-serif bg-[#0b0e2e]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="m-auto">
            {logo && (
              <img
                src={logo}
                alt="Attica Pan Masala Logo"
                className="h-full object-contain cursor-pointer"
                onClick={() => navigate("/")}
              />
            )}
            <div className="flex justify-start items-center gap-5 mt-4">
              <BsFacebook className="text-3xl text-blue-600 hover:text-blue-400" />
              <FaInstagram className="text-3xl text-red-600 hover:text-red-400" />
              <FaTwitter className="text-3xl text-blue-400 hover:text-blue-300" />
              <FaLinkedin className="text-3xl text-blue-600 hover:text-blue-500" />
              <FaSpotify className="text-3xl text-amber-600 hover:text-amber-500" />
            </div>
          </div>

          {LINKS.map((linkGroup, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{linkGroup.title}</h3>
              <ul>
                {linkGroup.items.map((item, idx) => (
                  <li key={idx} className="mb-2 hover:text-gray-400">
                    <Link to={item.path}>{item.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-lg font-semibold mb-4">{CONTACT_INFO.title}</h3>
            <ul>
              <li className="mb-2">
                <strong>Email Address:</strong> {CONTACT_INFO.details.email}
              </li>
              <li className="mb-2">
                <strong>Phone Number:</strong> {CONTACT_INFO.details.phone}
              </li>
              <li className="mb-2">
                <strong>Address:</strong>
                {CONTACT_INFO.details.address.map((line, idx) => (
                  <div key={idx}>{line}</div>
                ))}
              </li>
            </ul>
            
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 Attica Pan Masala. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
