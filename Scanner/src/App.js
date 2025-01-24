import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Register from './component/Register';
import Login from './component/Login';
import UserProfile from './pages/UserProfile';
import DeliveryBoyLogin from './component/DeliveryBoy/DeliveryBoyLogin';
import DeliveryBoyHomePage from './component/DeliveryBoy/DeliveryBoyHomepage';
import PageNotFound from './component/PageNotFound';
import Dashboard from './component/SuperStockistDelivery/Dashboard';
import MyOrders from './component/SuperStockistDelivery/MyOrder';
import { Help } from './component/SuperStockistDelivery/Help';


function App() {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('deliveryBoyToken');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PageNotFound />} />
        <Route path="/mobile" element={<PageNotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/DeliveryBoyLogin" element={<DeliveryBoyLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        {token ? (
          <>
            
            <Route path="/qrDetail" element={<UserProfile />} />
            <Route path="/DeliveryBoyHomePage" element={<DeliveryBoyHomePage />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/My-Orders" element={<MyOrders />} />
            <Route path="/help" element={<Help />} />
           
          </>
        ) : (
         
          <Route path="*" element={<Login />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
