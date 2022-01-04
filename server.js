const fs = require('fs')
const path = require('path')
const express = require('express')
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }))

app.use(express.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"))
})

app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    res.json(JSON.parse(data))
  })
})

app.post('/api/notes', (req, res) => {
  var currentNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuidv4()
  }
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

app.delete('/api/notes/:id', (req, res) => {
  var deletedId = req.params.id
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) throw err
    var database = JSON.parse(data)
    var newDatabase = database.filter(note => note.id !== deletedId)
    fs.writeFile('db/db.json', JSON.stringify(newDatabase), (err) => {
      err ? console.log(err) : console.log('Note Deleted');
    })
    res.sendFile(path.join(__dirname, "/public/notes.html"))
  })
})

app.listen(PORT, () => {
  console.log(`API server now on port http://localhost:${PORT}`);
})
