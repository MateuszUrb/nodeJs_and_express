const express = require("express");
const data = require("./data.json");

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>get persons json object from /api/persons</h1>");
});
app.get("/api/persons", (req, res) => {
  if (!data) {
    res.status(404).end();
  }
  res.send(data);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.info(`Server running on port: ${PORT}`);
});
