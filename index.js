require ('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const models = require('./models')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const path = require('path')
const router = require('./routes/index')
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const app = express();

app.use(express.json({limit: '70mb'}));
app.use(express.urlencoded({limit: '70mb'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);


const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, '0.0.0.0', () => console.log('server started on port', PORT))
    } catch (e) {
        console.log(e)
    }
}
start()

