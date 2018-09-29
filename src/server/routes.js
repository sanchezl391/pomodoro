const express = require('express')
const app = express()
const port = process.env.PORT || 3000


// Front End does requests something from server at some url
// If Backend is listening it catches the request and responds to request
// Response is sent back to front end and the front end does something with the response
// Maybe when get request is done, it is done to only initialize all values(get users from db). The request is always done from the front end

// On POST request (new entry will be added to db)
app.post('/', (req, res) => res.send('Attempting To Post'))

// On GET request, get all entries for the day
app.get('/', (req, res) => res.send('Caught get request!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))