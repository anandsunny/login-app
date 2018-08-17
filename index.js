const  express = require('express');
const app = express();  //initial express application
const router = express.Router();
const mongoose = require('mongoose'); //node tool for mongodb
const config = require('./config/database'); //mongoose config
const path = require('path'); // node js packege for file paths
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');
const cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) 
        console.log('Could not connect to database:', err);
    else 
        console.log('database connected successful.');
})


//  middleware's
app.use(cors({origin: 'http://localhost:4200'}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);

app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
})

app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen(8080, () => {
    console.log('lisining on port 8080');
});