const mysqlConnection = require("../database/db");
const util = require("util");

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

const addTask = async (name, description, listId) => {
  const res = await query(
    `insert into task (name, description, listId) values (?, ?, ?)`,
    [name, description, listId]
  );
  return res.insertId;
};

const removeTask = async (tId) => {
  const res = await query(`delete from task where tId = ?`, [tId]);
  return res;
};

const removeTasksByListId = async (listId) => {
  const res = await query(`delete from task where listId = ?`, [listId]);
  return res;
};

module.exports = {
  addTask,
  removeTask,
  removeTasksByListId,
};
