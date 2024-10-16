import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `\ndatabase/connectionDB.js : MongoDB connected! DB Host: ${connectionInstance.connection.host}`
        .green.bold
    );
  } catch (error) {
    console.error(`database/connectionDB.js :MongoDB connection error: ${error}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;

