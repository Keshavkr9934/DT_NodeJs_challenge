import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ quiet: true });



const client = new MongoClient(process.env.MONGO_URI);

export async function db() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db("dt_events");
}
