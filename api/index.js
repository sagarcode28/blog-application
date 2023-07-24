const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const PostModel = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const salt = bcrypt.genSaltSync(10);
const secret = 'jmdoadojodjO2KK';

const database_url = process.env.DATABASE_URL;
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());

main().catch(err => console.log(err));

async function main() {
    console.log('Entering...');
    await mongoose.connect(database_url);
    console.log("Database Connected...")
}

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userdoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userdoc);
    } catch (e) {
        console.log(e);
        res.status(400).json(e)
    }

});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userdoc = await User.find({ username });
    const passOk = bcrypt.compareSync(password, userdoc[0].password);
    if (passOk) {
        jwt.sign({ username, id: userdoc[0]._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: userdoc[0]._id,
                username
            });
        });
    } else {
        res.status(400).json('Wrong Credentials');
    }
});

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content, file} = req.body;
        const postdoc = await PostModel.create({
            title,
            summary,
            content,
            file,
            author: info.id,
        });
        res.json(postdoc);
    });
});

app.get('/post', async (req, res) => {
    const posts = await PostModel.find().populate('author', ['username']).sort({ createdAt: -1 }).limit(20);
    res.json(posts);
});

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postdoc = await PostModel.findById(id).populate('author', ['username']);
    res.json(postdoc);
});

app.put('/post/', async (req, res) => {

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id, title, summary, content, file} = req.body;
        const postdoc = await PostModel.findById(id);
        const isAuthor = JSON.stringify(postdoc.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json('You are not the Author');
        }
        await postdoc.updateOne({ title, summary, file, content });

        res.json(postdoc);
    });
});

app.delete('/deletePost/:id', async(req, res) => {
    const {id} = req.params;
    const response  = PostModel.findById(id);
    await PostModel.deleteOne(response);
    res.json('ok');
})

app.listen(8000);