const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

//Initializing server
const app = express();
app.use(bodyParser.json());
const port = 8086;
app.listen(port, () => {
  console.log("Server online on: " + port);
});
app.use("/", express.static("../front-end"));
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "siscomedy"
});
connection.connect(function (err) {
  console.log("Connected to database!");
  const sql =
    "CREATE TABLE IF NOT EXISTS candidati_inscrisi(nume VARCHAR(255),prenume VARCHAR(255),telefon VARCHAR(255),email VARCHAR(255), UNIQUE(email))";
  connection.query(sql, function (err, result) {
    if (err) throw err;
  });
});
app.post("/inscriere", (req, res) => {
  let contestant = {
    nume: req.body.nume,
    prenume: req.body.prenume,
    telefon: req.body.telefon,
    email: req.body.email,
  }

  let error = [];
  console.log(contestant);
  //verificam erori
  if (!contestant.nume || !contestant.prenume || !contestant.telefon || !contestant.email ) {
    error.push("Unul sau mai multe campuri nu au fost introduse");
    console.log("Unul sau mai multe campuri nu au fost introduse!");
  }
  else{
    if(contestant.nume.length < 3 || contestant.nume.length > 30){
      error.push("Numele este invalid");
      console.log("Numele este invalid");
    }
    if(contestant.prenume.length < 3 || contestant.prenume.length > 30){
      error.push("Prenumele este invalid");
      console.log("Prenumele este invalid");
    }
    if(!contestant.nume.match("^[A-Za-z]+$")){
      error.push("Numele trebuie sa contina numai litere")
      console.log("Numele trebuie sa contina numai litere")
    }
    if(!contestant.prenume.match("^[A-Za-z- ]+$")){
      error.push("Prenumele trebuie sa contina numai litere, cratima si spatiu")
      console.log("Prenumele trebuie sa contina numai litere, cratima si spatiu")
    }
    if (!(contestant.telefon.length == 10)) {
      console.log("Numarul de telefon trebuie sa fie de 10 cifre!");
      error.push("Numarul de telefon trebuie sa fie de 10 cifre!");
    } 
    if (!contestant.telefon.match("^[0-9]+$")) {
      console.log("Numarul de telefon trebuie sa contina doar cifre!");
      error.push("Numarul de telefon trebuie sa contina doar cifre!");
    }
    if (!contestant.email.includes("@gmail.com") && !contestant.email.includes("@yahoo.com") && !contestant.email.includes("@stud.ase.ro")) {
      console.log("Email invalid!");
      error.push("Email invalid!");
    }


  }
  

  if (error.length === 0) {
    const sql =
      `INSERT INTO candidati_inscrisi (nume,prenume,telefon,email) VALUES (?,?,?,?)`;
    connection.query(sql,
      [
        contestant.nume,
        contestant.prenume,
        contestant.telefon,
        contestant.email,
      ],
      function (err, result) {
        //verifica daca mailul este deja folosit
        try{
          if (err) throw err;
        }
        catch{
          console.log("email invalid");
          error.push("email deja folosit");
          res.status(500).send(error);
          console.log("contestantul nu a putut fi creat!");
          return;
        }
          
        console.log("contestant creat cu succes!");
        res.status(200).send({
          message: "contestant creat cu succes",
        });
        console.log(sql);
      });
  } else {
    res.status(500).send(error);
    console.log("Eroare la inserarea in baza de date!");
  }

});