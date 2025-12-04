import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log("++The Database was connect++")
  }
  catch (error) {
    console.error("--The database was not connected--",  error.message)
  }
}
export default connectDB; 