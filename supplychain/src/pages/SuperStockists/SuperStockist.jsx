import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";
import Logout from "../../utils/Logout";
import Navbar from "../../Components/Navbar/Navbar";
import ShopLogo from "../../assets/Panshop.png";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../constants";

const SuperStockist = () => {
  const [superstockists, setSuperstockists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(4);
  const [state, setState] = useState(""); // State to store fetched state

  useEffect(() => {
    const fetchStateFromEmail = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get(
            `${BASE_URL}/api/executives/getStateCity/${email}`
          );
          setState(response.data.state);
          localStorage.setItem('state', response.data.state);
        } catch (error) {
          console.error("Error fetching state from email:", error);
        }
      }
    };

    fetchStateFromEmail();
  }, []);

  useEffect(() => {
    const fetchSuperstockists = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/api/superStockistDetails`
        );
        setSuperstockists(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching superstockist data:", error);
        setError("Error fetching superstockist data");
        setLoading(false);
      }
    };

    fetchSuperstockists();
  }, []);

  // Filter superstockists based on fetched state
  const filteredSuperstockists = superstockists.filter(
    (superstockistGroup) => superstockistGroup._id === state
  );

  // Get current cards
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredSuperstockists.slice(indexOfFirstCard, indexOfLastCard);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-gray-200 h-screen">
      <Navbar />
      <div className="flex-1 ml-5 mr-5 md:ml-96">
        <Logout />
        <Link to="/myOrders" className="my-3 block md:hidden">
          My Order History
        </Link>
        <div className="flex flex-wrap gap-5 md:ml-20">
          {currentCards.map((superstockistGroup) =>
            superstockistGroup.shop_details.map((superstockist) => (
              <Card key={superstockist._id} className="w-full md:w-72 h-auto flex flex-col relative">
                <div className="h-36 w-full flex justify-center items-center">
                  <img src={ShopLogo} alt="Shop Logo" className="h-24 w-28 mt-2" />
                </div>
                <CardHeader
                  title={superstockist.registeredShopName.substring(0, 28)}
                  className="overflow-hidden text-wrap w-64 text-blue-600"
                />
                <CardContent className="flex-1">
                  <Typography variant="body1" gutterBottom>
                    <span className="font-semibold">Location:</span> {superstockist.location}
                  </Typography>
                  <Typography>
                    <span className="font-semibold">State:</span> {superstockistGroup._id}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <span className="font-semibold">Phone Number:</span> {superstockist.phoneNumber}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <span className="font-semibold">Email:</span> {superstockist.email}
                  </Typography>
                </CardContent>
                <Link
                  to={{
                    pathname: "/product-details",
                    state: { superstockistEmail: superstockist.email }
                  }}
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center md:relative md:mt-2"
                  onClick={() => localStorage.setItem('superstockistEmail', superstockist.email)}
                >
                  Order
                </Link>
              </Card>
            ))
          )}
        </div>
        <div className="mt-5 flex justify-center">
          {/* Pagination */}
          <ul className="flex justify-center gap-5">
            {Array.from(
              { length: Math.ceil(filteredSuperstockists.length / cardsPerPage) },
              (_, i) => (
                <li key={i}>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuperStockist;
