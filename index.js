require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req, res) => {
    if (req.method === 'POST') return JSON.stringify({ id: res.locals.createdNoteId, ...req.body })
    if (req.method === 'PUT') return res.locals.updatedBody
    return '{}'
})


// let persons = [
//     {
//         "id": 1,
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": 2,
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": 3,
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": 4,
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const { id } = request.params

    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

// const generateId = () => {
//     let newId
//     do {
//         newId = Math.floor(Math.random() * 1000000)
//     } while (persons.some(person => person.id === newId))
//     return newId
// }

app.post('/api/persons', (request, response, next) => {
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

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.status(201).json({
                message: 'Successfully created',
                id: savedPerson.id,
                name: savedPerson.name,
                number: savedPerson.number
            })
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const { id } = request.params

    Person.findByIdAndDelete(id)
        .then(deletedPerson => {
            response.status(200).json({
                message: 'Successfully deleted',
                id: deletedPerson.id,
                name: deletedPerson.name,
                number: deletedPerson.number
            })
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { id } = request.params
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.status(200).json({
                message: 'Successfully updated',
                id: updatedPerson.id,
                name: name,
                number: number
            })
        })
        .catch(error => next(error))
})

// app.get('/info', (request, response) => {
//     const currentTime = new Date()
//     const numberOfPeople = persons.length

//     response.send(`
//         <p>Phonebook has info for ${numberOfPeople} people</p>
//         <p>${currentTime}</p>
//     `)
// })

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})