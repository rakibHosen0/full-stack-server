const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const ObjectID = require("mongodb").ObjectID;

const port = process.env.PORT || 5055;

app.use(cors());
app.use(express.json());
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
  const collection = client.db("programmingBook").collection("events");
  const registrationsCollection = client
    .db("programmingBook")
    .collection("registrations");

  app.get("/events", (req, res) => {
    collection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/event/:id", (req, res) => {
    const { id } = req.params;

    collection.find({ _id: ObjectID(id) }).toArray((err, documents) => {
      res.send(documents[0]);
    });
  });

  app.post("/addRegistration", (req, res) => {
    const registration = req.body;
    registrationsCollection.insertOne(registration, (err, result) => {
      res.send({ count: result.insertedCount });
    });
  });

  app.get("/registrations", (req, res) => {
    registrationsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/registrationByEmail", (req, res) => {
    const { email } = req.body;
    registrationsCollection.find({ email: email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addEvent", (req, res) => {
    const event = req.body;
    collection.insertOne(event, (err, result) => {
      res.send({ count: result.insertedCount });
    });
  });

  app.delete("/registrationDelete/:id", (req, res) => {
    const id = req.params.id;
    registrationsCollection.deleteOne({ _id: ObjectID(id) }).then((result) => {
      res.send({ count: result.deletedCount });
    });
  });

  console.log("Database Connected success");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
