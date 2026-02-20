
const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("database.db");
db.serialize(()=>{
  db.run("CREATE TABLE IF NOT EXISTS leads(id INTEGER PRIMARY KEY, name TEXT, email TEXT, message TEXT)");
});

app.post("/api/lead",(req,res)=>{
  const {name,email,message} = req.body;
  db.run("INSERT INTO leads(name,email,message) VALUES(?,?,?)",[name,email,message]);
  res.json({status:"ok"});
});

app.get("/api/leads",(req,res)=>{
  db.all("SELECT * FROM leads",(err,rows)=> res.json(rows));
});

const upload = multer({ dest: "uploads/" });
app.post("/api/upload", upload.single("photo"), (req,res)=>{
  res.json({file:req.file.filename});
});

app.listen(3000,()=> console.log("Server running on http://localhost:3000"));
