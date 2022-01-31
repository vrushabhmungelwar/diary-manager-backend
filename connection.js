import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

export const createConnection = async () => {
  const client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    console.log("Mongodb Connected");
    return client;
  } catch (error) {
    console.log(error);
  }
};
