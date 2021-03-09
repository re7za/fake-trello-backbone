const mysqlConnection = require("../database/db");
const util = require("util");

const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

const getComments = async (taskId) => {
  const res = await query(
    `select commentId, content from comment where taskId = ?`,
    [taskId]
  );
  return res;
};

const addComment = async (content, taskId) => {
  const res = await query(
    `insert into comment (content, taskId) values (?, ?)`,
    [content, taskId]
  );
  return res.insertId;
};

const removeCommentsByTaskId = async (taskId) => {
  const res = await query(`delete from comment where taskId = ?`, [taskId]);
  return res;
};

module.exports = {
  getComments,
  addComment,
  removeCommentsByTaskId,
};
