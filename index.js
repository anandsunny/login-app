const  express = require('express')
const app = express()
const mongoose = require('mongoose');
const config = require('./config/database')


mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if(err) 
        console.log('Could not connect to database:' + err)
    else 
        console.log('database connected successful.')
})

app.get('/', (req, res) => {
    res.send('hello world');
})

app.listen(8080, () => {
    console.log('lisining on port 8080')
})