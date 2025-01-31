import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import Sidebar from "../sidebar/Sidebar";

export default function SidebarModel() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 600px)").matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    
    const handleMediaChange = (e) => {
      setIsMobile(e.matches);
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button 
        onClick={handleClickOpen}
        style={{ 
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px"
        }}
      >
        <FaBars className="text-3xl text-black" />
      </button>

      {open && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }} 
          onClick={handleClose}
        >
          <div 
            style={{
              padding: "20px",
              borderRadius: "4px",
              width: isMobile ? "100%" : "auto",
              height: isMobile ? "100%" : "auto",
              maxWidth: "90%",
              maxHeight: "90%",
              overflow: "auto",
              
            }} 
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full">
              <Sidebar onClose={handleClose} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
