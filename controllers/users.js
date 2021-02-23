const {
  getPassHashByUsername,
  createUser,
  userExistsByUsername,
} = require("../repositories/users");
const { hashPassword, checkPassword } = require("../utils/hash");

const registerUser = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userExistsByUsername(username);
    if (userExists) {
      res.send({ status: 422, msg: "User already exists" });
      return;
    }

    const hash = hashPassword(password);
    const insertedUid = await createUser(username, hash);

    if (insertedUid) {
      res.send({ status: 200, msg: "User created", uid: insertedUid });
    } else {
      throw "Idk exception";
    }
  } catch (exp) {
    console.error(exp);
    res.send({ status: 500 });
  }
};

const loginUser = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userExistsByUsername(username);
    if (!userExists) {
      res.send({ status: 422, msg: "The username doesn't exist!" });
      return;
    }

    const userPassHash = await getPassHashByUsername(username);
    const isPasswordCorrect = checkPassword(password, userPassHash[0].password);

    if (isPasswordCorrect) {
      res.send({ status: 200, msg: "Loged in successfully" });
    } else throw "You sucked.. password was wrong!";
  } catch (exp) {
    console.log(exp);
    res.send({ status: 500 });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
