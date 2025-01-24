import React from "react";

import "./App.css";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import { UpperFooter } from "./components/UpperFooter";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <>
    <ScrollToTop/>
    
      
  
      <Outlet />
      <UpperFooter />
      <Footer />
      
      
    </>
  );
}

export default App;
