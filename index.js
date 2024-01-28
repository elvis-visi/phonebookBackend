require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(express.static("dist"));

const Person = require('./models/person')


app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});


app.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date();
      const info = `
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `;
      response.send(info);
    })
    .catch(error => next(error));
});


app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id).then(person => {
   
    if(person){
      response.json(person)
    }else{
      response.status(404).end()
    }
  })
  .catch(error => next(error))

})

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(result => {
    response.status(204).end()  //204 no content.
   })
   .catch(error => next(error))

});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new : true})
  .then(upatedPerson => {
    response.json(upatedPerson)
  })
  .catch(error => next(error))


})


app.post("/api/persons/", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing name or number",
    });
  } 

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
