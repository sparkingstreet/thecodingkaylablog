const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//middleware to parse JSON bodies
app.use(bodyParser.json());

//mysql connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pEh1knBg@kdu8',
    database: 'thecodingkaylacomments'
});

//connect to mysql
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

//post route to add a new comment
app.post('/comments', (req, res) => {
    const {comment} = req.body;
    if (!comment) {
        return res.status(400).send({ message: 'Comment text is required'});
    }

    //sql query to insert the comment into the database
    const sql = 'INSERT INTO comments (commenttext) VALUES (?)';
    db.query(sql, [comment], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            return res.status(500) .send({ message: 'Failed to add comment' 
            });
        }
        res.status(201).send({message: 'comment added', id: result.instertId });
    });  
});

//get route to retrieve all comments
app.get('/comments', (req, res) => {
    const sql = 'SELECT * FROM comments ORDER BY createdat DESC';
    db.query(sql, (err, results) => {
        if(err) {
            console.error('Error fetching comments:', err);
            return res.status(500).send({ message: 'Failed to retrieve comments'});
        }
        res.send(resutls);
    });
});

//start server
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});