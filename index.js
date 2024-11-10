const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    if (req.method === 'POST') return JSON.stringify({ id: res.locals.createdNoteId, ...req.body })
    if (req.method === 'PUT') return res.locals.updatedBody
    return '{}'
})


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

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)


    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

const generateId = () => {
    let newId
    do {
        newId = Math.floor(Math.random() * 1000000)
    } while (persons.some(person => person.id === newId))
    return newId
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personDeleted = persons.find(person => person.id === id)

    persons = persons.filter(person => person.id !== id)

    response.json(personDeleted)
})

app.put('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const personUpdated = request.body

    persons = persons.map(person => person.id !== id ? person : personUpdated)
    response.json(personUpdated)
})

app.get('/info', (request, response) => {
    const currentTime = new Date()
    const numberOfPeople = persons.length

    response.send(`
        <p>Phonebook has info for ${numberOfPeople} people</p>
        <p>${currentTime}</p>
    `)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})