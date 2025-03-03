import * as dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const uri = process.env.MONGO_URI;

if (!uri) {
  console.log("MONGO_URI is not defined in .env file");
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
