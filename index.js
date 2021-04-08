const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Book Shop project running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zww7y.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("Error", err);
  const collection = client.db("volunteer").collection("events");
  console.log("Database Connected success");
  //   client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
