import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PlaceOrder.css";
import { Storecontext } from "../../context/StoreContext";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(Storecontext);

  // State for delivery info form
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

   // Update form data on change
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => ({ ...prev, [name]: value }));
  };

   // Function to place order
  const placeOrder = async (event) => {
    event.preventDefault();


     // Collect all items from cart
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItems[item._id] });
      }
    });


    let orderData = {
      userId: localStorage.getItem("userId"),
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      // Send order to backend
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      // When backend creates Stripe session, redirect to Stripe
      if (response.data.success && response.data.session_url) {
        console.log("Redirecting to Stripe:", response.data.session_url);
        window.location.href = response.data.session_url;
      } else {
        alert("Payment session not created");
      }
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  const navigate = useNavigate();

  // Redirect if no token or cart is empty
  useEffect(() => {
    if (!token) {
      console.warn("No token found, redirecting to /cart");
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      console.warn("Cart empty, redirecting to /cart");
      navigate("/cart");
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

         {/* First and last name */}
        <div className="multi-fields">
          <input autoComplete="off" required name="firstName" onChange={onChangeHandler} value={data.firstName} type="text" placeholder="First Name" />
          <input autoComplete="off" required name="lastName" onChange={onChangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>

          {/* Email and street */}
        <input autoComplete="off" required name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder="Email address" />
        <input autoComplete="off" required name="street" onChange={onChangeHandler} value={data.street} type="text" placeholder="Street" />

         {/* City and State */}
        <div className="multi-fields">
          <input autoComplete="off" required name="city" onChange={onChangeHandler} value={data.city} type="text" placeholder="City" />
          <input autoComplete="off" required name="state" onChange={onChangeHandler} value={data.state} type="text" placeholder="State" />
        </div>

         {/* Zip and Country */}
        <div className="multi-fields">
          <input autoComplete="off" required name="zipcode" onChange={onChangeHandler} value={data.zipcode} type="text" placeholder="Zip code" />
          <input  autoComplete="off"required name="country" onChange={onChangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>

        <input autoComplete="off" required name="phone" onChange={onChangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
                {/* Delivery Fee */}
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
              {/* Final Total */}
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

            {/* Payment button */}
          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
