// declare dependancies

const express = require('express') // help us to get the dependancies
const app = express();
const mysql = require ('mysql2');
const dotenv = require ('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();

//CRUCIAL..connect to the database*** to configure database connection.

const db = mysql.createConnection
({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
});

//check if db works
// if no
db.connect((err) => {
    if(err) return console.log("error connecting to the mysqldb")
    // if yes
    console.log("connected to mysql succesfully as id: ",db.threadid)


    // Question 1: Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving patients:', err);
        res.status(500).send('An error occurred while retrieving patients.');
      } else {
        res.json({ title: 'Patients List', data: results });
      }
    });
  });
  // Question 2: Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error retrieving providers:', err);
        res.status(500).send('An error occurred while retrieving providers.');
      } else {
        res.json({ title: 'Providers List', data: results });
      }
    });
  });
  
  // Question 3: Filter patients by First Name
  app.get('/patients/:firstName', (req, res) => {
    const { firstName } = req.params;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [firstName], (err, results) => {
      if (err) {
        console.error('Error filtering patients by first name:', err);
        res.status(500).send('An error occurred while filtering patients.');
      } else {
        res.json({ title: `Patients with First Name: ${firstName}`, data: results });
      }
    });
  });
  
  // Question 4: Retrieve all providers by their specialty
  app.get('/providers/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
    db.query(query, [specialty], (err, results) => {
      if (err) {
        console.error('Error retrieving providers by specialty:', err);
        res.status(500).send('An error occurred while retrieving providers by specialty.');
      } else {
        res.json({ title: `Providers with Specialty: ${specialty}`, data: results });
      }
    });
  });

 // start the server
 const port = 3300;
app.listen(process.env.port, () =>{
    console.log(`server listening on port ${process.env.PORT}`);

    // send a message to the browser
    console.log('sending message to browser....');
    app.get('/' , (req,res) => {
        res.send('server started succesfully today!')
    })
})

})
