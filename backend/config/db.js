import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected :- ${conn.connection.host} `);
  } catch (error) {
    console.log("MongoDB Connection Failed", error.message);
    process.exit(1);
  }
};

export default connectDatabase;
