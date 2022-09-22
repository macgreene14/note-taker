const express = require("express"); //import express module
const path = require("path");
const fs = require("fs");

app = express(); // instantiate app

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
  res.json(JSON.parse(db));
});

// recieve a note to save on the request body, add to db.json, return new note to client
// need to find a way to give each note a unique id when its saved (use npm package)
// use uuid  (copy miniproject, require functions)

app.post("/api/notes", (req, res) => {
  // read JSON file
  const db = fs.readFileSync(
    path.join(__dirname, "/db/db.json"),
    "utf8",
    (err, data) => {}
  );

  const notes = JSON.parse(db); // notes object
  console.log(notes);

  notes.push(req.body);
  console.log(notes);

  // write JSON to file
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    (err, data) => {}
  );

  res.sendStatus(200);
});

const PORT = 3001;
app.listen(PORT, () => console.log("Listening..."));
