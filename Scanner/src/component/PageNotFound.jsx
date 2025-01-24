import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import img from '../assets/404.png';

const PageNotFound = () => {
    const { '*': path } = useParams();
    const url = window.location.href;
    const navigate = useNavigate();
    const [clickedNumbers, setClickedNumbers] = useState([]);
    const [clickCount, setClickCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [code, setCode] = useState('');
    const [secondInputValue, setSecondInputValue] = useState(''); // State for second input field
    const [loader, setLoader] = useState(true);

    const API_URL= process.env.REACT_APP_API_URL;

    // Define the pattern to match
    const pattern = [1, 2, 3, 4];

    // Check if the clicked numbers match the pattern
    useEffect(() => {
        if (clickedNumbers.length === pattern.length) {
            const isPatternMatched = clickedNumbers.every((num, index) => num === pattern[index]);
            if (isPatternMatched) {
                navigate("/Login");
            }
        }
    }, [clickedNumbers, navigate, pattern]);

    const handleOnClick = (number) => {
        setClickedNumbers([...clickedNumbers, number]);
    };

    // Check if the image has been clicked five times
    useEffect(() => {
        if (clickCount === 5) {
            setShowModal(true);
        }
    }, [clickCount]);

    const handleImageClick = () => {
        setClickCount(prevCount => prevCount + 1);
    };

    const handleCloseModal = async () => {
        try {
           

            // Make POST request to the API endpoint
            const response = await axios.post(`${API_URL}/api/sos/sosalert`, {
                uniqueCode: code.trim(),
               
            });

            console.log(response.data); // Log the response if needed

            setShowModal(false);
        } catch (error) {
            console.error('Error submitting data:', error);
        } finally {
            setLoader(true);
            setCode('');
            setSecondInputValue(''); // Clear input fields after submission
        }
    };

    return (
        <>
            {
                !loader ? (
                    <span className="loader"></span>
                ) : (
                    <div className='relative h-screen w-full'>
                        <div className='absolute top-0 left-0'>
                            <div
                                className='lg:h-32 h-40 w-32 lg:w-32 flex justify-center items-center bg-black'
                                style={{ opacity: 0, pointerEvents: 'auto', cursor: 'pointer' }}
                                onClick={() => handleOnClick(1)}
                            ></div>
                        </div>
                        <div className='absolute top-0 right-0'>
                            <div
                                className='lg:h-32 h-40 w-32 lg:w-32 flex justify-center items-center bg-black'
                                style={{ opacity: 0, pointerEvents: 'auto', cursor: 'pointer' }}
                                onClick={() => handleOnClick(2)}
                            ></div>
                        </div>
                        <div className='absolute bottom-0 left-0'>
                            <div
                                className='lg:h-32 h-40 w-32 lg:w-32 flex justify-center items-center bg-black'
                                style={{ opacity: 0, pointerEvents: 'auto', cursor: 'pointer' }}
                                onClick={() => handleOnClick(3)}
                            ></div>
                        </div>
                        <div className='absolute bottom-0 right-0'>
                            <div
                                className='lg:h-32 h-40 w-32 lg:w-32 flex justify-center items-center bg-black'
                                style={{ opacity: 0, pointerEvents: 'auto', cursor: 'pointer' }}
                                onClick={() => handleOnClick(4)}
                            ></div>
                        </div>
                        <div className='flex justify-center content-center items-center h-full w-full px-10'>
                            <div id="main-content" className='my-2'>
                                <div>
                                    <img src={img} alt="" onClick={handleImageClick} />
                                </div>
                                <div className='my-10'>
                                    <h1 className='mb-2'>
                                        <span className='text-black mb-2 lg:text-xl'>This {url} page can't be found</span>
                                    </h1>
                                    <p className='text-gray-600 lg:text-sm text-xs mb-2'>No webpage was found for the web address: <span className='text-gray-700 font-semibold'>{url}</span></p>
                                    <div className="error-code text-gray-600 lg:text-sm text-xs mb-2">HTTP ERROR 404</div>
                                </div>
                                <div>
                                    <button className='text-white bg-[#1A73E8] px-3 py-1 rounded-full' onClick={() => window.location.reload()}>Reload</button>
                                </div>
                            </div>
                        </div>
                        {showModal && (
                            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
                                <div className='bg-white p-5 rounded-lg'>
                                    <h2 className='text-lg mb-4'>Input Required</h2>
                                    <input type="text" placeholder="Enter something" className='border p-2 mb-4 w-full' value={code} onChange={(e) => setCode(e.target.value)} />
                                   
                                    <button className='text-white bg-blue-500 px-4 py-2 rounded' onClick={handleCloseModal}>Submit</button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </>
    );
};

export default PageNotFound;
