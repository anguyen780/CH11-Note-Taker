
const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const notePage = require('./db/db.json')

const app = express();
const PORT = process.env.PORT || 3010; 

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        var notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    let notes = req.body;
    notes.id = uuidv4();
    notePage.push(notes);
    fs.writeFile('./db/db.json', JSON.stringify(notePage,null,2), (err) => {
        if(err) throw err;
        res.json(notes);
    });
});

app.delete("/api/notes/:id", (req, res) => {
   for (let i = 0; i < notePage.length; i++) {
    if (notePage[i].id === req.params.id){
        notePage.splice(i,1);
        break;
    }
   }
   fs.writeFile('./db/db.json', JSON.stringify(notePage), (err) => {
    if (err) throw err;
   })
   res.json(notePage)
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})
