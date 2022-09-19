const express = require("express");
const fs = require("fs");
const path = require("path");
const { uuid } = require("uuidv4");

const app = express();

const PORT = process.env.PORT || 3001;

// middle men set up
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  res.json(notes);
});

app.post("/api/notes", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  let newNote = req.body;
  newNote.id = uuid();

  let allNotes = [...notes, newNote];
  fs.writeFileSync("./db/db.json", JSON.stringify(allNotes));

  res.json(allNotes);
});

app.delete("/api/notes/:id", (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  let deleteNote = req.params.id;
  console.log('Id notes: ', deleteNote);

  let updateNotes = []
  notes.forEach(note => {
    if(note.id != deleteNote){
        updateNotes.push(note)
    }
  })

  console.log('Deleted notes: ', updateNotes);

  fs.writeFileSync("./db/db.json", JSON.stringify(updateNotes));
  res.json(updateNotes);
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
