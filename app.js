const { notDeepEqual } = require("assert");
const express = require("express");
const { json } = require("express/lib/response");
const app = express();

const fs = require("fs");

app.set("view engine", "pug");

app.use("/static", express.static("public"));

app.use(express.urlencoded({ extended: false }));

// localhost:5000
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post("/create", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;

  if (title.trim() === "" && description.trim() === "") {
    res.render("create", { error: true });
  } else {
    fs.readFile("./data/notes.json", (err, data) => {
      if (err) throw err;

      const notes = JSON.parse(data);

      notes.push({
        id: id(),
        title: title,
        description: description,
      });

      fs.writeFile("./data/notes.json", JSON.stringify(notes), (err) => {
        if (err) throw err;

        res.render("create", { success: true });
      });
    });
  }
});

app.get("/api/v1/notes", (req, res) => {
  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    res.json(notes);
  });
});
//
app.get("/notes", (req, res) => {
  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    res.render("notes", { notes: notes });
  });
});
//

app.get("/notes/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    const note = notes.find((note) => note.id == id);

    res.render("detail", { title: note.title, description: note.description });
  });
});
//

app.post("/notes/delete/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    const newNotes = notes.filter((note) => note.id !== id);

    res.redirect("/notes");

    fs.writeFile("./data/notes.json", JSON.stringify(newNotes), (err) => {
      if (err) throw err;

      res.render("create", { success: true });
    });
  });
});
// Edit
app.post("/notes/edit/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    const noteToUpdate = notes.find((note) => note.id === id);

    console.log(noteToUpdate);

    res.render("update", { note: noteToUpdate });
  });
});

app.post("/notes/update/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./data/notes.json", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);

    const noteToUpdate = notes.find((note) => note.id === id);

    noteToUpdate.title = req.body.title;

    noteToUpdate.description = req.body.description;

    fs.writeFile("./data/notes.json", JSON.stringify(notes), (err) => {
      if (err) throw err;

      res.redirect("/notes");
    });
  });
});

app.listen(5000, (err) => {
  if (err) console.log(err);

  console.log("server is running on port 5000...");
});

function id() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
