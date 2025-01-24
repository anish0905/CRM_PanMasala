import React from "react";
import { SuperStockistSideBar } from "./SuperStockistSideBar";

export const Help = () => {
  return (
    <div className=" bg-gray-100 min-h-screen">
    <SuperStockistSideBar />
    <div className="help-container p-6  lg:ml-96   mt-24 lg:mt-0">
     
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
        Delivery Boy Help Page
      </h1>

      {/* Introduction Section */}
      <div className="intro-section mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to the Help Page!</h2>
        <p className="text-gray-600">
          Here you can find answers to common questions and instructions on how to use the delivery system.
        </p>
      </div>

      {/* FAQs Section */}
      <div className="faq-section mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
        <div className="faq-item mb-4">
          <h3 className="font-semibold text-gray-700">1. How do I view my orders?</h3>
          <p className="text-gray-600">
            You can view your orders on the dashboard. All active orders assigned to you will be listed there.
          </p>
        </div>
        <div className="faq-item mb-4">
          <h3 className="font-semibold text-gray-700">2. How do I mark an order as delivered?</h3>
          <p className="text-gray-600">
            After delivering the order to the customer, go to the order details and mark it as delivered.
          </p>
        </div>
        <div className="faq-item mb-4">
          <h3 className="font-semibold text-gray-700">3. What should I do if I face any issues?</h3>
          <p className="text-gray-600">
            If you encounter any issues, please contact the support team through the contact form below or call the customer support number.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Support</h2>
        <p className="text-gray-600 mb-2">
          If you need further assistance, please feel free to reach out to us:
        </p>
        <p className="text-gray-600">Email: support@deliverycompany.com</p>
        <p className="text-gray-600">Phone: +1 800 123 4567</p>
      </div>

      {/* Instructions Section */}
      <div className="instructions-section mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Boy Instructions</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Make sure to verify the customer’s address before heading out.</li>
          <li>Always check the order details before leaving the warehouse.</li>
          <li>If you have any issues with the delivery, contact customer support immediately.</li>
          <li>Ensure to follow the traffic rules and regulations while delivering orders.</li>
        </ul>
      </div>

      {/* Conclusion Section */}
      <div className="conclusion-section">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Need more help?</h2>
        <p className="text-gray-600">
          If you still have questions, don't hesitate to reach out to our support team. We are here to assist you!
        </p>
      </div>
    </div>
    </div>
  );
};
