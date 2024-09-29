const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');  // Fixed 'required' to 'require'
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Eh1knBg@kdu8',  // Replace with your actual MySQL password
    database: 'thecodingkaylacomments'
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// POST route to add a new comment
app.post('/comments', (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).send({ message: 'Comment text is required' });
    }

    const sql = 'INSERT INTO comments (commenttext) VALUES (?)';
    db.query(sql, [comment], (err, result) => {
        if (err) {
            console.error('Error adding comment:', err);
            return res.status(500).send({ message: 'Failed to add comment' });
        }
        res.status(201).send({ message: 'Comment added', id: result.insertId });
    });
});

// GET route to retrieve all comments
app.get('/comments', (req, res) => {
    const sql = 'SELECT * FROM comments ORDER BY createdat DESC';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching comments:', err);
            return res.status(500).send({ message: 'Failed to retrieve comments' });
        }
        res.send(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
