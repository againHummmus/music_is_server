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

const allowedOrigins = [
    process.env.CLIENT_URL,
    "https://www.musicis.ru",
    "https://music-is.vercel.app/",
    "https://music-is-againhummmus-projects.vercel.app/",
    "https://music-is-git-master-againhummmus-projects.vercel.app/",
    "http://localhost:3000"
  ];

app.use(express.json({ limit: '70mb' }))
app.use(express.urlencoded({ limit: '70mb' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        } else {
            return callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}))
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/api', router)
app.use(ErrorMiddleware)

module.exports = app
