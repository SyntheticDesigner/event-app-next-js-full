import { MongoClient } from "mongodb";

export async function connectDb() {
  const client = await MongoClient.connect(
    "mongodb+srv://andrew:CUy9wAoGR97yebzq@cluster0.uozx1.mongodb.net/events?retryWrites=true&w=majority"
  );
  return client;
}

export async function insertDocument(client, collection, document) {
  //access the clients database
  const db = client.db();
  //insert the item into the database returns information about then result of our insertion request
  return await db.collection(collection).insertOne(document);
}

export async function getAllDocuments(client, collection, sort, filter = {}) {
  const db = client.db();
  const documents = await db
    .collection(collection)
    //find without any parameters will give all the entires from comments
    .find(filter)
    //sort comments by id in descending order
    .sort(sort)
    //by default it does not give you an array
    .toArray();
  return documents;
}
