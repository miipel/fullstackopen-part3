const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :data :status :res[content-length] - :response-time ms')
)

let persons = [
  // {
  //   name: 'Arto Hellas',
  //   number: '040-123456',
  //   id: 1
  // },
  // {
  //   name: 'Martti Tienari',
  //   number: '040-123456',
  //   id: 2
  // },
  // {
  //   name: 'Arto Järvinen',
  //   number: '040-123456',
  //   id: 3
  // },
  // {
  //   name: 'Lea Kutvonen',
  //   number: '040-123456',
  //   id: 4
  // }
]

app.get('/', (request, response) => {
  response.send('<p>Jaahas</p>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(Person.format))
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(Person.format(person))
    } else {
      response.status(404).end()
    }
  })
})

app.get('/info', (request, response) => {
  const date = `<p>${new Date()}</p>`
  const info = `<p>puhelinluettelossa on ${persons.length} henkilön tiedot</p>`
  response.send(info + date)
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return response.status(400).json({ error: 'name already exists' })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(Person.format(savedPerson))
  })
})

app.delete('/api/persons/:id', (request, response) => {
  try {
    Person.findOneAndDelete({ _id: request.params.id }).then(res => {
      response.status(204).end()
    })
  } catch (e) {
    console.log(e)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
