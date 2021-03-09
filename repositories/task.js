const mysqlConnection = require("../database/db");
const util = require("util");

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

const getTaskById = async (taskId) => {
  const res = await query(
    `select name, description, isDone from task where tId = ?`,
    [taskId]
  );
  return res;
};
const addTask = async (name, description, listId) => {
  const res = await query(
    `insert into task (name, description, listId) values (?, ?, ?)`,
    [name, description, listId]
  );
  return res.insertId;
};

const upgradeTask = async (name, description, tId) => {
  const res = await query(
    `update task set name = ?, description = ? where tId = ?`,
    [name, description, tId]
  );
  return res.affectedRow;
};

const removeTask = async (tId) => {
  const res = await query(`delete from task where tId = ?`, [tId]);
  return res;
};

const removeTasksByListId = async (listId) => {
  const res = await query(`delete from task where listId = ?`, [listId]);
  return res;
};

const changeStatus = async (tId, newVal) => {
  const res = await query(`update task set isDone = ? where tId = ?`, [
    newVal,
    tId,
  ]);
  return res;
};

const changeTaskParent = async (tId, listId) => {
  const res = await query(`update task set listId = ? where tId = ?`, [
    listId,
    tId,
  ]);
  return res;
};

module.exports = {
  getTaskById,
  addTask,
  upgradeTask,
  removeTask,
  removeTasksByListId,
  changeStatus,
  changeTaskParent,
};
