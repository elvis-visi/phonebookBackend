const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.json());

app.use(morgan("tiny"));

let phonebook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  return response.json(phonebook);
});

app.get("/info", (request, response) => {
  console.log("Headers:", request.headers);

  const date = new Date();
  const info = `
  <p></p>Phonebook has info for ${phonebook.length} people</p>
  <p>${date}</p>

  `;
  response.send(info);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((per) => per.id === id);

  if (!person) {
    return response.status(404).json({
      error: "person not found",
    });
  }
  return response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((p) => p.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 10000);
};

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing name or number",
    });
  } else if (phonebook.some((per) => per.name === body.name)) {
    return response.status(400).json({
      error: "unique names only",
    });
  }

  const per = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phonebook = phonebook.concat(per);

  response.json(per);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
