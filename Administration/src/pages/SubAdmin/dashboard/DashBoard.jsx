import React, { useEffect, useState } from "react";
import Sidebar from "../../SubAdmin/sidebar/Sidebar";
import SidebarModal from "../sidebar/SidebarModel";
import RightSideDrawer from "../../../components/RightSideDrawer";
import axios from "axios";
import { FaProductHunt, FaRunning } from "react-icons/fa";
import { MdIncompleteCircle } from "react-icons/md";
import { TbTruckDelivery } from "react-icons/tb";
import { Link } from "react-router-dom";
import OrderChart from "../../Admin/OrderChart";
import OrderStateWise from "../../Admin/OrderStateWise";


const Dashboard = () => {
  const [cnf,setCnf] = useState([])
  const [superStockist, setSuperStockist] = useState([]);
  const [Distributor, setDistributor] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState([]);
  const [panShopDetails, setPanShopDetails] = useState([]);
  const [pendingOrder, setPendingOrder] = useState(0);
  const [confirmedOrder, setConfirmedOrder] = useState(0);
  const [deliveredOrder, setDeliveredOrder] = useState(0);
  const [orders, setOrders] = useState([]);
  const [fieldManager, setFieldManager] = useState([]);
  const [fieldManagerAdmin, setFieldManagerAdmin] = useState([]);
  const currentUserId = localStorage.getItem("userId");

  const URI = import.meta.env.VITE_API_URL;
  const email = localStorage.getItem("email");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          CNF,
          superDistributor,
          Distributor,
          orderRes,
          // deliveryBoyRes,
          panShopDetailsRes,
          fieldManager
        ] = await Promise.all([
          axios.get(`${URI }/api/subAdmin/cnf/${currentUserId}`),
          axios.get(`${URI}/api/superstockist/getAllUser`),
          axios.get(`${URI }/api/distributor/getAlluser/`),
          axios.get(`${URI}/api/panshop/order/`),
          // axios.get(`${URI }/api/qrGeneraterBoy/allDetailsDeliverBoy`),
          axios.get(`${URI}/api/panShop/`),
          axios.get(`${URI}/api/fieldManager/getFieldManager`)
        ]);
         
       
        setCnf(CNF.data.data)
        setSuperStockist(superDistributor.data);
        setDistributor(Distributor.data);
        setOrders(orderRes.data);
        // setDeliveryBoy(deliveryBoyRes.data);
        setPanShopDetails(panShopDetailsRes.data.data);
        const FieldManagers = fieldManager.data.filter((manager) => manager.role === "FieldManager");
        const FieldManagersAdmin = fieldManager.data.filter((manager) => manager.role === "Admin");
        setFieldManagerAdmin(FieldManagersAdmin);
        setFieldManager(FieldManagers);

        const today = new Date().toISOString().slice(0, 10);
        const todayOrders = orderRes.data.filter(
          (order) => order.createdAt.slice(0, 10) === today
        );

        setPendingOrder(
          todayOrders.filter((order) => order.status === "pending").length
        );
        setConfirmedOrder(
          todayOrders.filter((order) => order.status === "confirmed").length
        );
        setDeliveredOrder(
          todayOrders.filter((order) => order.status === "delivered").length
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const totalOrder = orders.length;
  const sortedProducts = orders.sort((a, b) => b.totalPrice - a.totalPrice);
  const top5Products = sortedProducts.slice(0, 5);

  if (!superStockist.length) {
    return (
      <div className="flex justify-center items-center flex-col min-h-screen bg-blue-300">
        <Sidebar />
        <span className="loader"></span>
      </div>
    );
  }
  return (
    <div className="flex gap-6 bg-blue-100 w-full">
    <div className="min-h-screen  lg:block hidden">
      <Sidebar />
    </div>
    <div className="lg:ml-80 font-serif w-full lg:p-10 md:p-5">
      <div className="flex items-center  justify-between gap-5 p-10 bg-blue-300 rounded-xl">
        <h1 className="flex-grow text-start text-base sm:text-base md:text-lg lg:text-xl font-bold text-gray-800">
          Sub-Admin Dashboard
        </h1>
        <div className="relative">
         <RightSideDrawer />
         </div>
        <div className="hidden sm:flex items-center lg:text-2xl md:text-xl text-sm font-bold text-white border-4 border-[#1e40af] p-2 rounded-lg bg-[rgb(42,108,194)] hover:bg-blue-800 transition-colors duration-300 ease-in-out">
          {email}
        </div>
        
        <div className="lg:hidden  block">
          <SidebarModal />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 my-10">
        {[
          { title: "Today Order", value: pendingOrder, icon: FaProductHunt },
          { title: "On Going", value: confirmedOrder, icon: FaRunning },
          { title: "Completed Order", value: deliveredOrder, icon: MdIncompleteCircle },
          { title: "Total Order", value: totalOrder, icon: TbTruckDelivery },
        ].map(({ title, value, icon: Icon }, idx) => (
          <div
            key={idx}
            className="w-full rounded-lg h-40 bg-blue-800 p-5 flex flex-col justify-center items-center text-white"
          >
            <h1 className="text-2xl font-semibold">{title}</h1>
            <div className="flex items-center gap-2 text-4xl">
              <Icon />
              <span>{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* User Details and Charts */}
      <div className="lg:flex gap-5 my-8">
        <div className="bg-blue-800 text-white p-5 rounded-lg w-full">
          <h1 className="text-2xl bg-blue-300 p-3 rounded-lg my-4">Users</h1>
          {[
            { name: "CNF", count: cnf.length, link: "/manage/CNF/user/Sub-Admin" },
            { name: "SuperStockist", count: superStockist.length, link: "/manage/superstockist/user/Sub-Admin" },
            { name: "Distributor", count: Distributor.length, link: "/manage/Distributor/user/Sub-Admin" },
            { name: "Field Executive Approval", count: fieldManagerAdmin.length, link: "/Field-Executive-Approval/Admin/Sub-Admin" },
            { name: "Field Executive", count: fieldManager.length, link: "/Field-Executive-Approval/FieldManager/Sub-Admin" },
            { name: "Delivery Boy", count: deliveryBoy.length, link: "/deliveryboyDetails" },
            { name: "PanShop", count: panShopDetails.length, link: "/panshowDetails" },
          
          ].map(({ name, count, link }, idx) => (
            <Link
              key={idx}
              to={link}
              className="flex justify-between items-center p-2 px-4  hover:bg-blue-300 rounded-lg"
            >
              <span className="text-sm">{name}</span>
              <span className="text-sm">{count}</span>
            </Link>
          ))}
        </div>

        <div className="bg-blue-800 text-white p-5 rounded-lg w-full my-4">
          <h1 className="text-2xl bg-blue-300 p-3 rounded-lg">Top Products</h1>
          {top5Products.map((product, idx) => (
            <div key={idx} className="flex justify-between p-2">
              <span>{product.products[0]?.productName}</span>
              <span>₹{product.totalPrice}</span>
            </div>
          ))}
        </div>

        <div className="w-full my-8">
          <OrderChart product={orders} />
        </div>
      </div>

      <OrderStateWise />
      
    </div>
  </div>
  );
};

export default Dashboard;
