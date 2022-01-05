//we required this dependencies to make our application work. 'fs' is used to write a file
const fs = require('fs')
const path = require('path')
//express is our framework used in this project to create our server
const express = require('express')
//Using uuid we can create a unique ID number for our key values
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 3001;
const app = express();
//express.urlenocded is our middleware
app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(express.static('public'))

//we use app.get to request to our server the index.html file information
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})
//we use app.get to request throught our server our notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"))
})

//we use GET to request throught the server the API notes
app.get('/api/notes', (req, res) => {
  //use 'fs' this time to read a file from our db folder where all our data will be saved
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    res.json(JSON.parse(data))
  })
})

//with our post request we will add the  new note to our server
app.post('/api/notes', (req, res) => {
  //this variable contains the title, text and the unic number ID  that will be saved in our data once the user enters some information
  var currentNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  }

  //with 'fs' readfile, again we send the information to our server and added to the html as a current note
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    var database = JSON.parse(data)
    database.push(currentNote)
    fs.writeFile('db/db.json', JSON.stringify(database), (err) => {
      err ? console.log(err) : console.log('New note created');
    })
    res.sendFile(path.join(__dirname, "/public/notes.html"))
  })
})


//with the request 'delete' we managed to delete the note from the server and the browser.
app.delete('/api/notes/:id', (req, res) => {
  var deletedId = req.params.id
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    var database = JSON.parse(data)
    //as we deleted it we create a new note with this variable and filter. to success deleting we need to make sure that the unic ID is not equal to the same one required to be deleted, then we can add another note, else  if the ID number is equal, then the note is deleted and we console.log('Note Deleted')
    var newDatabase = database.filter(note => note.id !== deletedId)
    fs.writeFile('db/db.json', JSON.stringify(newDatabase), (err) => {
      err ? console.log(err) : console.log('Note Deleted');
    })
    res.sendFile(path.join(__dirname, "/public/notes.html"))
  })
})
//the API server will be listened in this port
app.listen(PORT, () => {
  console.log(`API server now on port http://localhost:${PORT}`);
})
