const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = require('../utils/config')

mongoose
  .connect(
    config.mongoUrl,
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('connected to database', config.mongoUrl)
  })
  .catch(err => {
    console.log(err)
  })

let personSchema = new Schema({ name: String, number: String, id: String })

personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

let Person = mongoose.model('Person', personSchema)

module.exports = Person
