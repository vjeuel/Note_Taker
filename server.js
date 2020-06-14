// Connections
const express = require("express");
const fs = require("fs");
const path = require("path");
const notesTaken = require("./db/db.json"); 

// App and PORT
const app = express();
const PORT = process.env.PORT || 3000;

// Express Use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// HTML Routes
app.get("/", (req, res) => {
   res.sendFile(path.join(`${__dirname}/public/index.html`));
});

app.get("/notes", (req, res) => {
   res.sendFile(path.join(`${__dirname}/public/notes.html`));
});

// API Routes
app.get("/api/notes", (req, res) => res.json(notesTaken));

app.post("/api/notes", (req, res) => {
    notesTaken.push(req.body);
    uniqueId();
    fs.writeFileSync("db.json", JSON.stringify(notesTaken))

    res.redirect("back");
});

app.delete("/api/notes/:id", (req, res) => {
   const deleted = notesTaken.findIndex((i) => i.id == req.params.id);
   notesTaken.splice(deleted, 1);
   reWrite();
   res.json(notesTaken);
  });

// Creation of Unique ID
function uniqueId() {
  notesTaken.forEach((element, i) => element.id = i + 1);
};

let reWrite = () => {
  fs.writeFile("db.json", JSON.stringify(notesTaken), (err) =>  {
    if (err) {
      throw err;
    };
  });
};

// Listen to PORT
app.listen(PORT, () => {
   console.log(`Listening on PORT ${PORT}`);
  
});