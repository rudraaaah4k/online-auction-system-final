import mongoose from "mongoose";

export const connection = () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database: ${err}`);
    });
};
