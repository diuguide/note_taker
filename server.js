// call in dependancies
const express = require('express');
const path = require('path');
const fs = require("fs");
const uuid = require('uuid');
const app = express();

// set port number or env for heroku
let PORT = process.env.PORT || 9000;
let dbJSON = path.join(__dirname, 'db', 'db.json');


// express specific code setting up your server
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
app.use(express.static('public'));

// get returns the index.html page
app.get('/', (req, res) => {
    const mainPage = path.join(__dirname, 'public', 'index.html');
    fs.readFile(mainPage, (err, data) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
})

// get returns the notes.html page
app.get('/notes', (req, res) => {
    const notesPage = path.join(__dirname, 'public', 'notes.html');
    fs.readFile(notesPage, (err, data) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
})

//reads the db json file and returns the saved notes as a JSON
app.get('/api/notes', (req, res) => {
    fs.readFile(dbJSON, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
})

// receives new note to save on the request body, adds it to the db.json file and then returns the new note to the client
app.post('/api/notes', (req, res) => {
    fs.readFile(dbJSON, 'utf8', (err, data) => {
        if (err) throw err;
        this.id = uuid.v4();
        let dbData = JSON.parse(data);
        req.body.id = this.id;
        dbData.push(req.body);
        fs.writeFile(dbJSON, JSON.stringify(dbData), (err) => {
            if (err) throw err;
            res.json(dbData);
        });
    });
})

// receives the ID assigned to the note, searches for that id in the db.json file, then removes the matching object from the array and returns a fresh json
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(dbJSON, 'utf8', (err, data) => {
        if (err) throw err;
        let deleteData = JSON.parse(data);
        let reqString = req.params.id;
        for(let i = 0; i < deleteData.length; i++){
            if(deleteData[i].id === reqString){
                let index = deleteData.findIndex(x => x.id === reqString);
                deleteData.splice(index, 1);
                fs.writeFile("./db/db.json", JSON.stringify(deleteData), function(err){
                    if(err){
                        return console.log(err);
                    }
                        console.log("success!");
                });
                res.json(deleteData);
            } 
        }
    });
});
