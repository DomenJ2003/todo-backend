const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const Posts = require("./services/posts");
const Users = require("./services/users");
const middleware = require("./services/middleware");

const app = express();
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ test: "hello" });
});

app.get("/api/v1/posts", async (req, res) => {
  const data = await Posts.getAllPosts();
  res.json({ posts: data });
});

app.post("/api/v1/create/post", [middleware], async (req, res) => {
  const post = {
    title: req.body.title,
    content: req.body.content,
    date: req.body.date,
    image: req.body.image,
    user_id: req.USER_ID,
  };
  const success = Posts.insertPost(post);
  res.json({ success });
});

app.get("/api/v1/users", async (req, res) => {
  const data = await Users.getAllUsers();
  res.json({ users: data });
});

app.get("/api/v1/profile", [middleware], async (req, res) => {
  const data = await Users.getProfile(req.USER_ID);
  const userPosts = await Posts.getPostsByUserId(req.USER_ID);
  res.json({
    profile: data.length ? data[0] : {},
    posts: userPosts,
    test: true,
  });
});

app.post("/api/v1/login", async (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };
  const [success, msg, jwt] = await Users.login(user);
  if (success) {
    const newUser = await Users.getByEmail(user.email);
    res.json({ success, msg, jwt, user: newUser });
  } else {
    res.json({ success, msg, jwt });
  }
});

app.post("/api/v1/register", async (req, res) => {
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const success = await Users.register(user);
  if (success) {
    const [success1, msg, jwt] = await Users.login(user);
    const newUser = await Users.getByEmail(user.email);
    res.json({ user: newUser, jwt, success: success });
  } else {
    res.json({ success: false });
  }
});

app.get("/api/v1/count", [middleware], async (req, res) => {
  const data = await Users.countPosts();
  res.json({ data });
});


const port = process.env.PORT || 5000;
app.listen(port);

console.log("App is listening on port " + port);

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});
