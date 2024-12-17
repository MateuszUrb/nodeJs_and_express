require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

function errorHanlder(error, req, res, next) {
  if (error.name === "CastError") {
    return res.status(400).json({ error: "incorect data" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
}

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

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findOneAndDelete({ _id: id })
    .then((person) => {
      if (person) {
        res.status(204).end();
      }
      res.status(404).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    res.status(400).json({ error: "missing name or number" });
  }

  const person = new Person({
    name,
    number: number.toString(),
  });
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  const { number } = req.body;

  if (!number) {
    return res.status(404).json({ error: "missing number" });
  }

  Person.findOneAndUpdate(
    { _id: id },
    { number },
    { new: true, runValidators: true },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        res.json(updatedPerson);
      } else {
        res.status(404).send({ error: "Person not found" });
      }
    })
    .catch((error) => next(error));
});

function unknownEndpoint(req, res) {
  res.status(404).send({ error: "unknown endpoint" });
}

app.use(unknownEndpoint);

app.use(errorHanlder);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.info(`Server running on port: ${PORT}`);
});
