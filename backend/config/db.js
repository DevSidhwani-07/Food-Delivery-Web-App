import mongoose from "mongoose"

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://dev:93598@cluster0.pbweogk.mongodb.net/food-del')
    .then(()=>console.log("✅ Database Connected"))
}