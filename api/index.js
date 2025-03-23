require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('../routes/index')
const bodyParser = require('body-parser')
const ErrorMiddleware = require('../middlewares/errorHandlingMiddleware')

const app = express()

app.use(express.json({ limit: '70mb' }))
app.use(express.urlencoded({ limit: '70mb' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(ErrorMiddleware)

module.exports = app
