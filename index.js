require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

app.get("/info", (req, res) => {
  const requestDate = new Date();
  Person.countDocuments({}).then((count) => {
    const resBody = `<p>Phonebook has info for ${count} people</p>
    <p>${requestDate}</p>`;
    res.send(resBody);
  });
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => {
    res.json(person);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(id).then((returnedPerson) => {
    res.json(returnedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findOneAndDelete({ _id: id })
    .then(() => {
      res.status(204).end();
    })
    .catch((error) => {
      res.status(500).json({ error: "server error while deliting person" });
    });
});

function generateId() {
  return (Math.random() * Number.MAX_SAFE_INTEGER).toFixed(0);
}

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    res.status(400).json({ error: "missing name or number" });
  }

  const person = new Person({
    name,
    number: number.toString(),
  });
  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.put("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const { name, number } = req.body;

  Person.findOneAndUpdate(
    { _id: id },
    { name, number },
    { new: true, runValidators: true },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(400).send({ error: "Invalid data" });
    });
});

function unknownEndpoint(req, res) {
  res.status(404).send({ error: "unknown endpoint" });
}

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.info(`Server running on port: ${PORT}`);
});
