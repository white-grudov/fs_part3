const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('req-body', (req, res) => {
    return JSON.stringify(req.body)
})

const loggingFormat = ':method :url :status :response-time ms - :req-body'
app.use(morgan(loggingFormat))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const info = `
      Phonebook has info for ${persons.length} people<br/>
      ${new Date()}
    `;
    response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        response.json(person);
    } else {
        response.status(404).send('Person not found');
    }
});

app.post('/api/persons', (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number missing' });
    }

    const duplicatePerson = persons.find(person => person.name === body.name);

    if (duplicatePerson) {
        return response.status(400).json({ error: 'Name must be unique' });
    }

    const newPerson = {
        id: generateRandomId(),
        name: body.name,
        number: body.number
    };

    persons.push(newPerson);

    response.json(newPerson);
});

const generateRandomId = () => {
    const minId = 1;
    const maxId = 1000000;
    return Math.floor(Math.random() * (maxId - minId + 1)) + minId;
};
