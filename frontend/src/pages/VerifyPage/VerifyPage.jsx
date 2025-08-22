import React, { useContext, useEffect } from 'react'
import './VerifyPage.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Storecontext } from '../../context/StoreContext';
import axios from 'axios';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

   // Get backend URL and user token from context
  const { url, token } = useContext(Storecontext);
  const navigate = useNavigate();

  useEffect(() => {
     // Function to verify payment with backend
    const verifyPayment = async () => {
      // try {
      //    // Send request to backend with payment status and orderId
      //   const response = await axios.get(url + "/api/order/verify", { success, orderId }, { headers: { token } }
      //   );

       try {
        const response = await axios.get(url + "/api/order/verify", {
          params: { success, orderId },
          headers: { token }
        });

         // If backend confirms payment, go to My Orders page
        if (response.data.success) {
          navigate("/myorders");

           // If payment fails, go back to cart
        } else {
          navigate("/cart");
        }
      } catch (err) {
        console.error(err);
        navigate("/cart");
      }
    };

    verifyPayment();
  }, [success, orderId, url, token, navigate]);

  return (
    <div className='verify'>
       {/* Loading spinner while payment is being verified */}
      <div className="spinner"></div>
    </div>
  )
}

export default VerifyPage
