const express = require("express"); //import express module
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

app = express(); // instantiate app

const PORT = process.env.PORT || 3001; //specify port

// add middleware
app.use(express.static("public")); // add path to static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// return notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// read db.json and return saved notes as JSON
app.get("/api/notes", (req, res) => {
  // read JSON file
  const db = fs.readFileSync(
    path.join(__dirname, "/db/db.json"),
    "utf8",
    (err, data) => {}
  );

  // parse and send
  if (db) {
    res.json(JSON.parse(db));
  }
});

// recieve a note to save on the request body, add to db.json, return new note to client
// need to find a way to give each note a unique id when its saved (use npm package)
// use uuid  (copy miniproject, require functions)

app.post("/api/notes", (req, res) => {
  // read JSON file
  let db = fs.readFileSync(
    path.join(__dirname, "/db/db.json"),
    "utf8",
    (err, data) => {}
  );
  console.log("DATABASE BLANK", db);
  // if data exists
  if (!db) {
    db = "[]"; //create new JSON array
  }

  // parse existing data
  let notes = JSON.parse(db); // notes object

  // new note from request body, add unique id
  let note = req.body;
  note.id = uuidv4();

  // add new entry
  notes.push(note);

  // write JSON to file
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    (err, data) => {}
  );

  res.sendStatus(200);
});

// delete entry with id provided as path param
app.delete("/api/notes/:id", (req, res) => {
  // read JSON file
  const db = fs.readFileSync(
    path.join(__dirname, "/db/db.json"),
    "utf8",
    (err, data) => {}
  );

  let notes = JSON.parse(db); // notes object

  // iterate through notes, and remove object where id matches path param
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === req.params.id) {
      notes.splice(i, 1); // remove obj from list
    }
  }

  // write JSON to file
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    (err, data) => {}
  );

  res.sendStatus(200);
});

app.listen(PORT, () => console.log("Listening..."));
