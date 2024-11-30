// PaymentCancellationPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancellationPage = () => {
  const navigate = useNavigate();

  const handleGoToHomepage = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Payment Cancelled</h1>
        <p className="mb-6">
          We're sorry, your payment was not completed successfully. Please try again or contact our support team if you have any issues.
        </p>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleGoToHomepage}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentCancellationPage;