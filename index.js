require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const PORT = process.env.PORT

morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body)
})

const Person = require('./models/person') 

const loggingFormat = ':method :url :status :response-time ms - :req-body'
app.use(morgan(loggingFormat))

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
      response.json(person)
    })
  })

app.get('/info', (request, response) => {
    Person.find({}).then(person => {
        response.send(`<p>Phonebook has info for ${person.length} people</p>`)
    })
  })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
      response.json(person)
    })
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ error: 'content missing' })
    }
  
    const note = new Person({
        name: body.name,
        number: body.number,
    })
  
    note.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

const generateRandomId = () => {
    const minId = 1;
    const maxId = 1000000;
    return Math.floor(Math.random() * (maxId - minId + 1)) + minId;
};
