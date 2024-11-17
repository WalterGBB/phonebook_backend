const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://waztercraft:${password}@cluster0.wsmtr.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')

        if (process.argv.length === 3) {
            // Si solo hay 3 argumentos, listar todas las notas
            Person.find({}).then(persons => {
                result.forEach(person => {
                    console.log(person)
                })
                mongoose.connection.close()
            })
        } else if (process.argv.length === 5) {
            // Si hay más de 3 argumentos, guardar una nueva nota
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            })

            person.save().then(() => {
                console.log('person saved!')
                mongoose.connection.close()
            })
        }
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error)
    })