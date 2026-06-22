import mongoose from "mongoose";
import dns from "dns";

// Windows machines sometimes fail the mongodb+srv:// DNS lookup from Node
// specifically (querySrv ECONNREFUSED), even when the OS resolver works fine.
// Pointing Node's resolver at a public DNS server fixes it reliably.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;