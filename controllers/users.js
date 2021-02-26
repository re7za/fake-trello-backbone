const {
  getPassHashByUsername,
  createUser,
  userExistsByUsername,
} = require("../repositories/users");
const { generateToken } = require("../utils/jwt");

// Utils
const { hashPassword, checkPassword } = require("../utils/hash");

const registerUser = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;
    const userExists = await userExistsByUsername(username);
    if (userExists) {
      res.send({ status: 422, msg: "user already exists" });
      return;
    }

    const hash = hashPassword(password);
    const insertedUid = await createUser(username, hash);

    if (insertedUid) {
      res.send({ status: 200, msg: "user created", uid: insertedUid });
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
      res.send({ status: 422, msg: "the username doesn't exist!" });
      return;
    }

    const userPassHash = await getPassHashByUsername(username);
    const isPasswordCorrect = checkPassword(password, userPassHash[0].password);
    if (isPasswordCorrect) {
      const token = generateToken({ username });

      res.send({ status: 200, msg: "Loged in successfully", token });
    } else console.error("password was wrong!");
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `mission failed`,
      exeption,
    });
  }
};

const whoAmI = async (req, res) => {
  res.send(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  whoAmI,
};
