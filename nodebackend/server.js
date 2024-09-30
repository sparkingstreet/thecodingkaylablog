const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');  // Fixed 'required' to 'require'
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

//Initialize supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);


// POST route to add a new comment
app.post('/comments', async (req, res) => {
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).send({message: 'comment text required'});
    }

    //insert comment into supabase
    const { data, error } = await supabase.from('comments')
    .insert([{ commenttext: comment }]);

    if (error) {
        console.error('Error adding comment:', error);
        return res.status(500).send({ message: 'Failed to add comment'});
    }

    res.status(201).send({ message: 'Comment added', id: data[0].id });
});


// GET route to retrieve all comments
app.get('/comments', async (req, res) => {
    const { data, error } = await supabase
    .from('comments')
    .select('*')
    .order('createdat', {ascending: false });

    if(error) {
        console.error('error fetching comments:', error);
        return res.status(500).send({ message: 'Failed to retrieve comments'});
    }

    res.send(data);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
