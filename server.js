const express = require('express');
const path = require('path');
const fs = require("fs");
const app = express();
const PORT = 9000;
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
        console.log(data);
    });
})
app.post('/api/notes', (req, res) => {

    fs.readFile(dbJSON, 'utf8', (err, data) => {
        if (err) throw err;
        let dbData = JSON.parse(data);
        console.log(dbData);
        dbData.push(req.body);
        console.log(dbData);
        fs.writeFile(dbJSON, JSON.stringify(dbData), (err) => {
            if (err) throw err;
            res.json(dbData);
        });
    });
})

app.delete('/api/notes/:id', (req, res) => {
    res.send('Got a DELETE request at /user')
})