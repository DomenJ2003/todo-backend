const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require('./services/db');
const Posts = require('./services/posts')
const Users = require('./services/users');
const middleware = require('./services/middleware');

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

app.get('/api/v1/users', async (req, res) => {
    const data = await Users.getAllUsers();
    res.json({ users: data });
});

app.get('/api/v1/profile', [middleware], async (req, res) => {
    const data = await Users.getProfile(req.USER_ID);
    res.json({ profile: data.length ? data[0] : {} });
});

app.post('/api/v1/login', async (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    };
    const [status, msg, jwt] = await Users.login(user);
    res.json({ status, msg, jwt });
});

app.post('/api/v1/register', async (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    const success = await Users.register(user);
    res.json({ success });
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);

app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

