// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// const placeOrder = async (req, res) => {

// <<<<<<< HEAD
//    const frontend_url = process.env.FRONTEND_URL;
// =======
//    const frontend_url = "https://food-delivery-web-app-frontend-2ydb.onrender.com/cart";
// >>>>>>> fcd7dc84cbd1b0b9ed4debd44b8f610800090098
//    try {
//        // Create a new order in MongoDB
//       const newOrder = new orderModel({
//          userId: req.body.userId,
//          items: req.body.items,
//          amount: req.body.amount,
//          address: req.body.address
//       })
//       await newOrder.save();

//        // Clear user’s cart after order is placed
//       await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//       // Prepare Stripe line_items (products for checkout)
//       const line_items = req.body.items.map((item) => ({
//          price_data: {
//             currency: "gbp",
//             product_data: {
//                name: item.name
//             },
//             unit_amount: item.price * 100
//          },
//          quantity: item.quantity
//       }))
 
//       // Add delivery charges as a separate line item
//       line_items.push({
//          price_data: {
//             currency: "gbp",
//             product_data: {
//                name: "Delivery Charges"
//             },
//             unit_amount: 2 * 100
//          },
//          quantity: 1
//       })

//       // Create a Stripe Checkout session
//       const session = await stripe.checkout.sessions.create({
//           payment_method_types: ["card"],
//          line_items: line_items,
//          mode: 'payment',
//          success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
//          cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
//       })

//       res.json({ success: true, session_url: session.url });

//    } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: "Error" });

//    }
// }

// const verifyOrder = async (req, res) => {
//    const { orderId, success } = req.query.orderId ? req.query : req.body;
//    try {
//       if (success == "true") {
//          // If payment successful → mark order as paid
//          await orderModel.findByIdAndUpdate(orderId, { payment: true });
//          // res.json({ success: true, message: "Paid" });
//          // return res.redirect(`${process.env.FRONTEND_URL}/myorders`);
//          return res.json({success:true, redirect:"/myorders"})
//       }
//       else {
//          // Else delete the order
//          await orderModel.findByIdAndDelete(orderId);
//          // res.json({ success: false, message: "No Paid" })
//          //  return res.redirect(`${process.env.FRONTEND_URL}/cart`);
//          return res.json({success:false, redirect:"/cart"})
//       }
//    } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: "Error" })

//    }
// }

// // user orders for frontend
// const userOrders = async (req, res) => {
//    try {
//        // Show all orders of logged-in user
//        const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });
//       res.json({ success: true, data: orders })
//    } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: "Error" })

//    }
// }

// // Listing orders for admin panel
// const listOrders = async (req, res) => {
//    try {
//       const orders = await orderModel.find({});
//       res.json({ success: true, data: orders })
//    } catch (error) {
//       console.log(error);
//       res.json({ success: false, message: "Error" })
//    }
// }


// // api for updating order status
// const updateStatus = async (req, res) => {
//    try {
//       await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
//       res.json({success:true,message:"Status Updated"})
//    } catch (error) {
//       console.log(error);
//       res.json({success:false,message:"Error"})
      
//    }
// }
// export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus }


import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
   // Use frontend URL from environment variable
   const frontend_url = process.env.FRONTEND_URL;

   try {
      // Create a new order in MongoDB
      const newOrder = new orderModel({
         userId: req.body.userId,
         items: req.body.items,
         amount: req.body.amount,
         address: req.body.address
      });
      await newOrder.save();

      // Clear user’s cart after order is placed
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

      // Prepare Stripe line_items (products for checkout)
      const line_items = req.body.items.map((item) => ({
         price_data: {
            currency: "gbp",
            product_data: {
               name: item.name
            },
            unit_amount: item.price * 100
         },
         quantity: item.quantity
      }));

      // Add delivery charges as a separate line item
      line_items.push({
         price_data: {
            currency: "gbp",
            product_data: {
               name: "Delivery Charges"
            },
            unit_amount: 2 * 100
         },
         quantity: 1
      });

      // Create a Stripe Checkout session
      const session = await stripe.checkout.sessions.create({
         payment_method_types: ["card"],
         line_items: line_items,
         mode: "payment",

         success_url: `${frontend_url}/myorders?success=true&orderId=${newOrder._id}`,

         cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });

      res.json({ success: true, session_url: session.url });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

const verifyOrder = async (req, res) => {
   const { orderId, success } = req.query.orderId ? req.query : req.body;
   try {
      if (success === "true") {
         // If payment successful → mark order as paid
         await orderModel.findByIdAndUpdate(orderId, { payment: true });
         return res.json({ success: true, redirect: "/myorders" });
      } else {
         // Else delete the order
         await orderModel.findByIdAndDelete(orderId);
         return res.json({ success: false, redirect: "/cart" });
      }
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

// user orders for frontend
const userOrders = async (req, res) => {
   try {
      const orders = await orderModel
         .find({ userId: req.userId })
         .sort({ date: -1 });
      res.json({ success: true, data: orders });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
   try {
      const orders = await orderModel.find({});
      res.json({ success: true, data: orders });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

// api for updating order status
const updateStatus = async (req, res) => {
   try {
      await orderModel.findByIdAndUpdate(req.body.orderId, {
         status: req.body.status,
      });
      res.json({ success: true, message: "Status Updated" });
   } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
   }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };