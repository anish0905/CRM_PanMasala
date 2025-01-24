import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShopCaseMap from './ShowCaseMap';
import FEASidebar from '../../../components/Sidebar/FEASidebar';

const FEAShowCase = () => {
    const [showCases, setShowCase] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showCaseModalOpen, setShowCaseModalOpen] = useState(false);
    const [selectLocation, setSelectLocation] = useState();

    const BASE_URL = import.meta.env.VITE_API_URL;
    const userDetails = localStorage.getItem("email") // Assuming user details are stored in local storage

    useEffect(() => {
        fetchFEAShowCase();
    }, []);

    const fetchFEAShowCase = async () => {
        try {
            const resp = await axios.get(`${BASE_URL}/api/showCase/showcase`);
            setShowCase(resp.data.data);
        } catch (error) {
            console.error('Error fetching showcase list:', error);
            setError('Failed to fetch showcase list');
        }
    };

    const filteredShowCases = showCases.filter(showCase =>
        showCase?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showCase?.fieldManagerId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        showCase?.fieldManagerId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const sortedShowCases = filteredShowCases.sort((a, b) => {
        const aRating = a.reviews.reduce((sum, review) => sum + review.rating, 0) / a.reviews.length || 0;
        const bRating = b.reviews.reduce((sum, review) => sum + review.rating, 0) / b.reviews.length || 0;
        return bRating - aRating;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedShowCases.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 10; i++) {
            stars.push(<span key={i} className={i <= rating ? "text-yellow-500" : "text-gray-300"}>★</span>);
        }
        return stars;
    };

    const handleLocationModal = (location) => {
        setShowCaseModalOpen(true);
        setSelectLocation(location);
    };



    return (
        <div className="min-h-screen bg-blue-100 flex w-full">
            <div>
                <FEASidebar />
            </div>
            <div className="w-full p-4">
                <header className="bg-blue-300 rounded-md shadow-md p-4 flex justify-between items-center gap-4">
                    <h1 className="md:text-lg text-xs lg:text-xl font-bold text-gray-800 pl-12">Showcase Report</h1>
                    <div className="flex items-center gap-2">

                        <div className="text-sm lg:text-lg font-bold text-white border-4 border-blue-900 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 transition duration-300 ease-in-out">
                            {userDetails || "Guest"}
                        </div>
                    </div>
                </header>

                {error && <p className="text-red-600">{error}</p>}

                <div className="overflow-x-auto bg-[#1E40AF] my-4 p-4 rounded-md">
                    <div className="my-4">
                        <input
                            type="text"
                            placeholder="Search by product name, Field Executive Name, email"
                            className="border p-2 rounded-md w-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <table className="min-w-full table-auto border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-[#1e87ff] text-white rounded-md p-4">
                                <th className="border border-gray-300 p-2">Field Executive </th>
                                <th className="border border-gray-300 p-2">Product Details</th>
                                <th className="border border-gray-300 p-2">fragrance</th>
                                <th className="border border-gray-300 p-2">Taste/Flavor</th>
                                <th className="border border-gray-300 p-2">Product Similarity</th>
                                <th className="border border-gray-300 p-2">Over all Reviews </th>
                                <th className="border border-gray-300 p-2">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((showCase, index) => (
                                    <tr key={index} className='hover:bg-gray-100 bg-white'>
                                        <td className="border border-gray-300 p-4 text-left align-top">
                                            <div className="space-y-2">
                                                <p className="font-bold text-gray-800 text-lg">{showCase.fieldManagerId.name}</p>
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                        <path d="M2 6v12h20V6H2zm18 2v4H4V8h16z" />
                                                    </svg>
                                                    {showCase.fieldManagerId.email}
                                                </p>
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.27 11.72 11.72 0 0 0 3.7.59 1 1 0 0 1 1 1v3.94a1 1 0 0 1-1 1A16 16 0 0 1 3 4a1 1 0 0 1 1-1h3.94a1 1 0 0 1 1 1 11.72 11.72 0 0 0 .59 3.7 1 1 0 0 1-.27 1z" />
                                                    </svg>
                                                    {showCase.fieldManagerId.phoneNo}
                                                </p>
                                            </div>
                                        </td>


                                        <td className="border border-gray-300 p-4  text-center align-top">
                                            <div className="space-y-2">
                                                
                                                <div className="mt-2 flex justify-center items-center content-center">
                                                    <img
                                                        src={`${BASE_URL}/uploads/${showCase?.productId?.image}`}
                                                        alt={showCase?.productId?.title || "Product Image"}
                                                        className="w-24 h-24 object-cover border rounded-md shadow-sm"
                                                    />
                                                </div>
                                                <p className="font-semibold text-gray-800">{showCase?.productId?.title}</p>
                                                <p className="text-gray-600 text-sm">{showCase?.productId?.description}</p>
                                            </div>
                                        </td>

                                        <td className="border border-gray-300 p-2">{showCase.fragrance.map((review, revIndex) => (
                                                <div key={revIndex}>
                                                    <div className='text-center text-2xl'>{renderStars(review.rating)}</div>
                                                  
                                                </div>
                                            ))}</td>
                                        <td className="border border-gray-300 p-2">{showCase.tasteAndFlavor.map((review, revIndex) => (
                                                <div key={revIndex}>
                                                    <div className='text-center text-2xl'>{renderStars(review.rating)}</div>
                                                   
                                                </div>
                                            ))}</td>
                                        <td className="border border-gray-300 p-2">{showCase.productSimilarity}</td>
                                        <td className="border border-gray-300 p-2">
                                            {showCase.reviews.map((review, revIndex) => (
                                                <div key={revIndex}>
                                                    <div className='text-center text-2xl'>{renderStars(review.rating)}</div>
                                                   
                                                </div>
                                            ))}
                                        </td>
                                        <td className="border border-gray-300 p-2">
                                            {showCase.locations.map((location, locIndex) => (
                                                <div key={locIndex}>
                                                    <button
                                                        onClick={() => handleLocationModal(location)}
                                                        className="bg-blue-500 p-2 my-2 rounded-md text-white"
                                                    >
                                                        View Location
                                                    </button>
                                                    <br />
                                                    {new Date(location.timestamp).toLocaleString()}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="border border-gray-300 p-2 text-center">No showcase items available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {showCaseModalOpen && selectLocation && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                            <div className="absolute inset-0 bg-black opacity-50"></div>
                            <div className="z-50 bg-white w-[80%] p-8 rounded-lg shadow-lg">
                                <ShopCaseMap selectLocation={selectLocation} setShowCaseModalOpen={setShowCaseModalOpen} />
                            </div>
                        </div>
                    )}


                </div>

                <div className="flex justify-center gap-2 my-4">
                    {Array.from({ length: Math.ceil(filteredShowCases.length / itemsPerPage) }, (_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => paginate(index + 1)}
                            className={`border px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FEAShowCase;
