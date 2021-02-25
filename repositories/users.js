const mysqlConnection = require("../database/db");
const util = require("util");

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

const formatRow = function (row) {
  let { password, ...result } = row;
  return result;
};

const userExistsByUsername = async (username) => {
  const results = await query(`select * from user where username = ?`, [
    username,
  ]);
  return !!results.length;
};

const createUser = async (username, password) => {
  const results = await query(
    `insert into user (username, password) values ('${username}', '${password}')`
  );
  return results.insertId;
};

const getPassHashByUsername = async (username) => {
  const passHash = await query(`select password from user where username = ?`, [
    username,
  ]);
  return passHash;
};

const findByUsername = async (username) => {
  const results = await query(`select * from user where username = ?`, [
    username,
  ]);
  return !!results.length ? formatRow(results[0]) : null;
};

module.exports = {
  userExistsByUsername,
  createUser,
  getPassHashByUsername,
  findByUsername,
};
