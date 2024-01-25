const express = require("express");
const app = express();

const phonebook = [
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

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
