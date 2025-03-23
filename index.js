require ('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes/index')
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const ErrorMiddleware = require('./middleware/errorHandlingMiddleware')
const app = express();

app.use(express.json({limit: '70mb'}));
app.use(express.urlencoded({limit: '70mb'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);
app.use(ErrorMiddleware);

const start = async () => {
    try {
        app.listen(PORT, '0.0.0.0', () => console.log('server started on port', PORT))
    } catch (e) {
        console.log(e)
    }
}
start()

