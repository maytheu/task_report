import mongoose from "mongoose";
import { env } from "./validate";

class Db {
  mongoUrl = env.MONGODB;

  constructor() {
    mongoose.connection.once("open", () => console.log("Database connected"));
    mongoose.connection.on("error", async (e) => {
      console.log(e);
      await this.disconnectMongo();
    });
  }

  connectMongo = async () => {
    await mongoose.connect(this.mongoUrl);
  };

  disconnectMongo = async () => {
    await mongoose.disconnect();
  };
}
 
export default new Db();
