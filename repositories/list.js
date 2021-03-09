const mysqlConnection = require("../database/db");
const util = require("util");

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

const getListsWithTasks = async (username) => {
  const listsWithTasks = await query(
    `select lId, list.name as lName, tId, task.name as tName, description, deadLine, task.listId as taskParentId, isDone from list left join task on list.lId = task.listId`
  );
  return listsWithTasks;
};

const addList = async (name, userId) => {
  const res = await query(`insert into list (name, userId) values (?, ?)`, [
    name,
    userId,
  ]);
  return res.insertId;
};

const removeList = async (lId) => {
  const res = await query(`delete from list where lId = ?`, [lId]);
  return res;
};

module.exports = {
  getListsWithTasks,
  addList,
  removeList,
};
