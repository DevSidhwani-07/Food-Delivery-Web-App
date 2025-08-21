import foodModel from "../models/foodModel.js";
import fs from 'fs'

// Function to format category name (capitalize first letter)
const formatCategory = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const addFood = async (req, res) => {
    try {
        const image_filename = `${req.file.filename}`;

         // Create a new food item
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: formatCategory(req.body.category.trim()),
            image: image_filename
        });

        await food.save();
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// List all foods
const listFood = async (req, res) => {
    try {
        // Find all foods from database
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

// Remove Food
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);

         // Remove image file from "uploads" folder
        fs.unlink(`uploads/${food.image}`, () => { });

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food Removed" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
}

export { addFood, listFood, removeFood }
