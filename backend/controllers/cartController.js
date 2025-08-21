import userModel from "../models/userModel.js";

// Add to cart
const addToCart = async (req, res) => {
    try {

        // Find the user using userId
        let userData = await userModel.findById(req.body.userId);

        // Get user's current cart data (if empty, make a new object)
        let cartData = userData.cartData || {};
        
         // If item is not in cart, add it with quantity = 1
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {

             // If item already in cart, increase quantity by 1
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Added to cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};


// Remove from cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = userData.cartData || {};
        
        // If item exists and quantity > 0, reduce quantity by 1
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
         
        // If item quantity becomes 0, remove the item from cart
        if (cartData[req.body.itemId] <= 0) {
            delete cartData[req.body.itemId];
        }

        // If item quantity becomes 0, remove the item from cart
        await userModel.findByIdAndUpdate(req.body.userId, { cartData });
        res.json({ success: true, message: "Removed from cart" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

 
// Get cart
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);

          // Send user's cart data, if empty then send empty object 
        res.json({ success: true, cartData: userData.cartData || {} });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export { addToCart, removeFromCart, getCart };
