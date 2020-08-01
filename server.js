const express = require('express');
const path = require('path');
const fs = require("fs");
const uuid = require('uuid');
const app = express();
let PORT = process.env.PORT || 9000;
let dbJSON = path.join(__dirname, 'db', 'db.json');
let requestBody = [];
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
app.use(express.static('public'));
app.get('/', (req, res) => {
    const mainPage = path.join(__dirname, 'public', 'index.html');
    fs.readFile(mainPage, (err, data) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
})
app.get('/notes', (req, res) => {
    const notesPage = path.join(__dirname, 'public', 'notes.html');
    fs.readFile(notesPage, (err, data) => {
        if (err) throw err;
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
})
app.get('/api/notes', (req, res) => {
    fs.readFile(dbJSON, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
})
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
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(dbJSON, 'utf8', (err, data) => {
        if (err) throw err;
        let deleteData = JSON.parse(data);
        
        console.log(deleteData);
       
        let reqString = req.params.id;
        
        for(let i = 0; i < deleteData.length; i++){
            // if the currentNotes id equals the front end id
            if(deleteData[i].id === reqString){
                // getting the index of an object inside an array:  
                // https://stackoverflow.com/questions/15997879/get-the-index-of-the-object-inside-an-array-matching-a-condition
                let index = deleteData.findIndex(x => x.id === reqString);
                // remove the object with the matching id
                deleteData.splice(index, 1);
                // rewrite json file with the updated notes
                fs.writeFile("./db/db.json", JSON.stringify(deleteData), function(err){
                    if(err){
                        return console.log(err);
                    }
                        console.log("success!");
                });
                // respond to the user with the new notes
                res.json(deleteData);
                console.log(deleteData);
            } 
        }
    });
});
