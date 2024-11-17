const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        // minLength: 3,
        require: true,
        validate: {
            validator: function (v) {
                return v.length >= 3
            },
            message: props => `${props.value} is too short. Please enter a name of at least 3 letters`
        },
    },
    number: {
        type: String,
        // minLength: 8,
        required: true,
        validate: [
            {
                validator: function (v) {
                    return v.length >= 8
                },
                message: props => `${props.value} is too short. Phone number must have at least 8 characters.`
            },
            {
                validator: function (v) {
                    return /^\d{2,3}-\d+$/.test(v)
                },
                message: props =>
                    `${props.value} is not a valid phone number! Format must be XX-XXXXXXX or XXX-XXXXXXXX.`
            }
        ]
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
