const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "alumnidb"
});

db.connect(err => {
  if (err) console.log("DB error:", err);
  else console.log("MySQL Connected");
});

app.get("/alumni", (req, res) => {
  db.query("SELECT * FROM alumni ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.post("/alumni", (req, res) => {
  const { name, school, year, priority, category } = req.body;

  db.query(
    "INSERT INTO alumni (name, school, year, priority, category, completed) VALUES (?, ?, ?, ?, ?, ?)",
    [name, school || "", year || 0, priority || "medium", category || "School", false],
    (err, result) => {
      if (err) {
        console.log("INSERT ERROR:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ added: true });
    }
  );
});

app.put("/alumni/:id", (req, res) => {
  const { name, school, priority, category, completed } = req.body;

  db.query(
    "UPDATE alumni SET name=?, school=?, priority=?, category=?, completed=? WHERE id=?",
    [name, school || "", priority || "medium", category || "School", completed, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: true });
    }
  );
});

app.delete("/alumni/:id", (req, res) => {
  db.query(
    "DELETE FROM alumni WHERE id=?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ deleted: true });
    }
  );
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});