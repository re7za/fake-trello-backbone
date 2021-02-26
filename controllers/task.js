const { addTask, removeTask } = require("../repositories/task");

const createTask = async (req, res) => {
  try {
    const listId = Number(req.body.listId);
    const name = req.body.name;
    const description = req.body.description;

    const newTaskId = await addTask(name, description, listId);
    if (newTaskId) {
      res.send({
        status: 200,
        msg: "Task is created successfully",
        taskId: newTaskId,
      });
    } else console.error("something went wrong while creating");
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `mission failed`,
      exeption,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const tId = Number(req.body.tId);

    const result = await removeTask(tId);
    if (result) {
      res.send({
        status: 200,
        msg: `task ${tId} is removed successfully`,
      });
    } else console.error("something went wrong while deleting task");
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `failed to delete`,
      exeption,
    });
  }
};

module.exports = {
  createTask,
  deleteTask,
};
