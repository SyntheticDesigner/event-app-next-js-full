import {
  connectDb,
  getAllDocuments,
  insertDocument,
} from "../../../helpers/db-util";

export default async function handler(req, res) {
  const eventId = req.query.eventId;
  let client;
  try {
    client = await connectDb();
  } catch (error) {
    res.status(500).json({ message: "Cannot connect to Database!" });
    return;
  }
  //open the client !!!DONT FORGET TO CLOSE IT WHEN YOU ARE DONE!!!

  if (req.method === "POST") {
    //deconstruct the request body
    const { email, name, text } = req.body;

    //add server side validation
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (
      !email.match(pattern) ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid Input" });
      client.close();
      return;
    }

    //build out the comment with the information we get from the request
    const newComment = {
      email,
      name,
      text,
      eventId,
    };
    let result;
    try {
      result = await insertDocument(client, "comments", newComment);
      //this is how you get the ID that mongoInerts when you add something to a collection
      newComment._id = result.insertedId;
      //don't forget its the res status you want to set not the req
      res.status(201).json({ message: "Added Comment", comment: newComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Comment submission was not successful!" });
    }
  }
  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(
        client,
        "comments",
        { _id: -1 },
        { eventId: eventId }
      );
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: "Getting comments failed!" });
    }
  }
  //Close the client at the end
  client.close();
}
