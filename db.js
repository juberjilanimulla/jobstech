import mongoose from "mongoose";

async function dbConnect(req, res) {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("unable to connected Database", error);
  }
}

export default dbConnect;
