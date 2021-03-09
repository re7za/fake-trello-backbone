const mysqlConnection = require("../database/db");
const util = require("util");

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

const getChecklists = async (taskId) => {
  const res = await query(`select cId, title from checklist where taskId = ?`, [
    taskId,
  ]);
  return res;
};

const addCheckList = async (title, taskId) => {
  const res = await query(
    `insert into checklist (title, taskId) values (?, ?)`,
    [title, taskId]
  );
  return res.insertId;
};

const removeCheckListsByTaskId = async (taskId) => {
  const res = await query(`delete from checklist where taskId = ?`, [taskId]);
  return res;
};

module.exports = {
  getChecklists,
  addCheckList,
  removeCheckListsByTaskId,
};
