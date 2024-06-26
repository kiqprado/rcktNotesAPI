require('dotenv/config')
require('express-async-errors')


const migrationsRun = require('./database/sqlite/migrations')
const AppError = require('./utils/AppError')
const cors = require('cors')
const express = require('express')
const routes = require('./routes')

const uploadConfig = require('./configs/uploads')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

app.use(routes)

migrationsRun()

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
})

const PORT = process.env.SERVER_PORT || 3113
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
