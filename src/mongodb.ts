import { MongoClient } from "mongodb";
import { Application } from "./declarations";

export default function (app: Application): void {
  const connection = app.get("mongodb");
  const database = connection.substr(connection.lastIndexOf("/") + 1);
  const mongoClient = MongoClient.connect(connection).then(client => {console.log("Connected"); return client.db(database);}).catch(console.error);

  app.set("mongoClient", mongoClient);
}
