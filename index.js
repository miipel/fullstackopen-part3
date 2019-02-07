const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
// const morgan = require('morgan')
const mongoose = require('mongoose')
const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')
const config = require('./utils/config')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(middleware.logger)
// morgan.token('data', (req, res) => {
//   return JSON.stringify(req.body)
// })
// app.use(
//   morgan(':method :url :data :status :res[content-length] - :response-time ms')
// )

app.use('/api/persons', personsRouter)

app.use(middleware.error)

const server = http.createServer(app)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}