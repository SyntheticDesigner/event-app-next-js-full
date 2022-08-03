import { connectDb, insertDocument } from "../../helpers/db-util";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = JSON.parse(req.body);
    const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (!email || !email.match(pattern)) {
      res.status(422).json({ message: "Invalid Email Address" });
      return;
    }

    let client;

    try {
      client = await connectDb();
    } catch (error) {
      res.status(500).json({ message: "Connecting to the database failed!" });
      return;
    }

    try {
      await insertDocument(client, "newsletter", { email: email });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Inserting data failed!" });
      return;
    }
    res.status(201).json({ message: "success", feedback: email });
  }
}
