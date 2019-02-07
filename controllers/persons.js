const personsRouter = require('express').Router()
const Person = require('../models/person')

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(Person.format))
  })
})

personsRouter.get('/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if(person) {
      response.json(Person.format(person))
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

personsRouter.delete('/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

personsRouter.post('/', (request, response) => {
  const body = request.body

  if(body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(Person.format(savedPerson))
  })
})

personsRouter.put('/:id', (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findOneAndUpdate({ _id: request.params.id }, person)
    .then(newPerson => {
      response.json(Person.format(newPerson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

personsRouter.get('/info', (request, response) => {
  Person.estimatedDocumentCount({}).then(count => {
    const date = `<p>${new Date()}</p>`
    const info = `<p>Puhelinluettelossa on ${count} henkilön tiedot</p>`
    response.send(info + date)
  })
})

module.exports = personsRouter