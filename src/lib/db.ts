import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};


const connectToDatabase = async (): Promise<void> => {
  if (connection.isConnected) {    // to prevent multiple connections leading to database choking in next js as next js keeps refreshing the page whereas a backend server would only connect once as it keeps running
    console.log("Using existing database connection");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("Connected to the database successfully");
  } catch (error) {
    console.error("Error connecting to the database : ", error);
    process.exit(1);
  }
};

export default connectToDatabase;
