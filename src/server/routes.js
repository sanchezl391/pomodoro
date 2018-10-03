const time = require('../time.js')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3001


app.use(cors());
// Front End does requests something from server at some url
// If Backend is listening it catches the request and responds to request
// Response is sent back to front end and the front end does something with the response
// Maybe when get request is done, it is done to only initialize all values(get users from db). The request is always done from the front end

// On POST request (new entry will be added to db)
app.post('/', (req, res) => res.send('Attempting To Post'))
let strDate = time.getDate();
let minutes = 500;

const addDataToTableQuery = {
    text: 'INSERT INTO logs (date, minutes) VALUES($1, $2)',
    values: [strDate, minutes]
}
// On GET request, get all entries for the day


// Connect to DB
app.get('/', (req, response) => {
    const { Client } = require('pg')
    
    let strDate = time.getDate();
    
    const getLogsFromDB = {
        text: 'SELECT minutes FROM logs WHERE date = $1',
        values: [strDate]
    };

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'pomodoroapp',
        password: 'beastiePancake16',
        port: 5432
    });

    client.connect();

    client.query(getLogsFromDB, (err, res) => {
        response.send(res.rows);
        client.end();
    });
})


app.listen(port, () => console.log(`Listening on port ${port}!`))