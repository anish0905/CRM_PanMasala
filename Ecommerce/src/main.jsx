import { StrictMode } from "react";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";
import Jijivisha from "./store/index.js";
import {Product} from "../src/components/Product/Product.jsx"



import ScrollToTop from "./ScrollToTop.jsx"; // Import ScrollToTop
import Login from "./components/Login.jsx";
import  OrderHistory  from "./components/OrderHistory.jsx";

const id = localStorage.getItem("id");
// Define your router outside of the provider
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/login/:panshopOwner_id", element: <Login /> },
      { path: "/OrderHistory", element: <OrderHistory /> },
    
      { path: id ? "/admin" : null, element: id ? <Product /> : null },
     
    ]
  }
]);

// Wrap RouterProvider with ThemeProvider
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={Jijivisha}>
        <RouterProvider router={router}>
          <ScrollToTop /> {/* ScrollToTop inside RouterProvider */}
        </RouterProvider>
      </Provider>
    </ThemeProvider>
  </StrictMode>
);
