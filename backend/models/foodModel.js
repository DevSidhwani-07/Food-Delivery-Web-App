import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true }
});

// Function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


// Before saving a food item, format its category 
foodSchema.pre("save", function (next) {
    if (this.category) {
        this.category = capitalizeFirstLetter(this.category);
    }
    next();
});

// Before updating a food item, format its category if it exists in update
foodSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();
    if (update.category) {
        update.category = capitalizeFirstLetter(update.category);
    }
    next();
});

const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
