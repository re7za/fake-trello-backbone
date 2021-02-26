const express = require("express");
const app = express();
const usersController = require("./controllers/users");
const listController = require("./controllers/list");
const taskController = require("./controllers/task");

var cors = require("cors");
const port = 3001;
const { verifyToken } = require("./utils/jwt");

var bodyParser = require("body-parser");
const { findByUsername } = require("./repositories/users");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      let tokenData = verifyToken(token);
      let user = await findByUsername(tokenData.username);
      if (!user) {
        throw "Token is valid, user is invalid";
      }
      req.user = user;
      next();
    } catch (authorizationException) {
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// Auth
app.post("/signup", usersController.registerUser);
app.post("/login", usersController.loginUser);
app.get("/whoami", auth, usersController.whoAmI);

// List
app.get("/list", auth, listController.getUsersListsWithTasks);
app.post("/list", auth, listController.createList);
app.delete("/list", auth, listController.deleteList);

// Task
app.post("/task", auth, taskController.createTask);
app.delete("/task", auth, taskController.deleteTask);
