import axios from "axios";
import { createContext, useEffect } from "react";
import { useState } from "react";

// Global context
export const Storecontext = createContext(null);

const StorecontextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const url = "https://food-delivery-web-app-backend-vgfo.onrender.com";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);

     // Function to add item in cart
    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
             // If item not in cart, set quantity = 1
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
             // If item already in cart, increase quantity
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }

        // Update cart in backend if logged in
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }
    }

     // Function to remove item from cart
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

     // Function to calculate total cart amount
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }

        }
        return totalAmount;
    }

    // Fetch food list from backend
    const fetchFoodList = async () => {
        const response = await axios.get(url + '/api/food/list');
        setFoodList(response.data.data)
    }

    // Load cart data from backend
    const loadCartData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        setCartItems(response.data.cartData || {});
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
             // If user is logged in, load token and cart
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])

     // Values shared with all components
    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken

    }
    return (
        <Storecontext.Provider value={contextValue}>
            {props.children}
        </Storecontext.Provider>
    )
}

export default StorecontextProvider
