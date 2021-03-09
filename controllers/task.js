const {
  getTaskById,
  addTask,
  upgradeTask,
  removeTask,
  changeStatus,
} = require("../repositories/task");
const {
  getChecklists,
  addCheckList,
  removeCheckListsByTaskId,
} = require("../repositories/checklist");
const {
  getComments,
  addComment,
  removeCommentsByTaskId,
} = require("../repositories/comment");

const getTask = async (req, res) => {
  try {
    const taskId = Number(req.query.task_id);

    const comments = await getComments(taskId);
    const checklists = await getChecklists(taskId);
    const task = (await getTaskById(taskId))[0];

    res.send({
      status: 200,
      smg: `task ${taskId} fetched successfully`,
      data: {
        task,
        checklists,
        comments,
      },
    });
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `failed to delete: ${exeption}`,
      exeption,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const listId = Number(req.body.listId);
    const name = req.body.name;
    const description = req.body.description;
    const checklists = req.body.checklists;
    const comments = req.body.comments;

    const newTaskId = await addTask(name, description, listId);
    if (!newTaskId) console.error("something went wrong while creating");

    const newChecklistsIds = await Promise.all(
      checklists.map(async (checklist) => {
        return await addCheckList(checklist, newTaskId);
      })
    );

    const newCommentsIds = await Promise.all(
      comments.map(async (comment) => {
        return await addComment(comment, newTaskId);
      })
    );

    res.send({
      status: 200,
      msg: "Task is created successfully",
      payload: { newTaskId, newChecklistsIds, newCommentsIds },
    });
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `mission failed successfully :D`,
      exeption,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const tId = Number(req.body.tId);
    const name = req.body.name;
    const description = req.body.description;
    const checklists = req.body.checklists;
    const comments = req.body.comments;

    await upgradeTask(name, description, tId);

    await removeCheckListsByTaskId(tId);
    checklists.map(async (checklist) => {
      return await addCheckList(checklist, tId);
    });

    await removeCommentsByTaskId(tId);
    comments.map(async (comment) => {
      return await addComment(comment, tId);
    });

    res.send({
      status: 200,
      msg: `task ${tId} is updated successfully`,
    });
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `mission failed successfully :D`,
      exeption,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const tId = Number(req.body.tId);

    const removeChecklistsIds = await removeCheckListsByTaskId(tId);
    const removeCommentsIds = await removeCommentsByTaskId(tId);
    const removeTaskId = await removeTask(tId);

    if (removeTaskId) {
      res.send({
        status: 200,
        msg: `task ${tId} is removed successfully`,
      });
    } else console.error("something went wrong while deleting task");
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `failed to delete: ${exeption}`,
      exeption,
    });
  }
};

const changeTaskStatus = async (req, res) => {
  try {
    const tId = req.body.tId;
    const newVal = req.body.newVal;
    const result = await changeStatus(tId, newVal);

    if (result) {
      res.send({
        status: 200,
        smg: `task ${tId} status is changed`,
      });
    }
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `failed to delete: ${exeption}`,
      exeption,
    });
  }
};

module.exports = {
  getTask,
  createTask,
  updateTask,
  deleteTask,
  changeTaskStatus,
};
