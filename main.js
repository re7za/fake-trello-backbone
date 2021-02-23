const express = require("express");
const app = express();
// const utils = require("./utils/hash");
const usersController = require("./controllers/users");
var cors = require("cors");
const port = 3001;

var bodyParser = require("body-parser");
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use(cors());

app.post("/signup", usersController.registerUser);
app.post("/login", usersController.loginUser);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
