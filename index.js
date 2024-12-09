const express = require("express");
let data = require("./data.json");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>get persons json object from /api/persons</h1>");
});

app.get("/info", (req, res) => {
  const requestDate = new Date();
  const resBody = `<p>Phonebook has info for ${data.length} people</p>
  <p>${requestDate}</p>`;
  res.send(resBody).end();
});

app.get("/api/persons", (req, res) => {
  if (!data) {
    res.status(404).end();
  } else {
    res.send(data);
  }
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = data.find((person) => person.id === id);

  if (!person) {
    res.status(404).end();
  } else {
    res.send(person);
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  data.filter((person) => person.id !== id);
  res.status(204).end();
});

function generateId() {
  return (Math.random() * Number.MAX_SAFE_INTEGER).toFixed(0);
}

app.post("/api/persons", (req, res) => {
  const reqBody = req.body;
  const isReqNameInData = data.find((person) => person.name === reqBody.name);

  if (!reqBody.name || !reqBody.number) {
    res.status(400).json({ error: "missing name or number" });
  } else if (isReqNameInData) {
    res.status(400).json({ error: "name must be unique" });
  } else {
    const newPerons = {
      id: generateId(),
      name: reqBody.name,
      number: reqBody.number.toString(),
    };
    data = data.concat(newPerons);
    res.json(data);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.info(`Server running on port: ${PORT}`);
});
