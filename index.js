const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const db = require('./services/db');
const Posts = require('./services/posts')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(cors());

app.get('/', (req, res)=>{
    res.json({
        test: "hello"
    })
})

app.get('/api/v1/posts', async (req, res)=>{
    const data = await Posts.getAllPosts();
    res.json({
        posts: data
    })
})

app.post('/api/v1/create/post', (req, res)=>{
    const post = {
        title: "naslov",
        content: "vsebina",
        date: 'nek date'
    }
    const success = Posts.insertPost(post)
    res.json({
        success: success
    })
})


const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});