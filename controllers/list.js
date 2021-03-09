const {
  getListsWithTasks,
  addList,
  removeList,
} = require("../repositories/list");
const { removeTasksByListId } = require("../repositories/task");

const getUsersListsWithTasks = async (req, res) => {
  try {
    const flatLists = await getListsWithTasks(req.user.username);
    if (flatLists) {
      let formattedList = [];
      flatLists.forEach((el) => {
        formattedList[el.lId] = formattedList[el.lId] || [];
        formattedList[el.lId].push({
          id: el.tId,
          name: el.tName,
          isDone: el.isDone,
          description: el.description,
        });
      });
      let lists = [];
      Object.keys(formattedList).forEach((key) => {
        let el = formattedList[key];
        lists.push({
          id: key,
          name: flatLists.filter((item) => key == item.lId)[0].lName,
          tasks: el,
        });
      });
      res.send({ status: 200, msg: "List is fetched successfully", lists });
    } else console.error("Something went wrong while fetching data");
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `mission failed successfully :D`,
      exeption,
    });
  }
};

const createList = async (req, res) => {
  try {
    const uid = req.user.uid;
    const listName = req.body.name;

    const newListId = await addList(listName, uid);
    if (newListId) {
      res.send({
        status: 200,
        msg: "List is created successfully",
        listId: newListId,
      });
    } else console.error("something went wrong while creating");
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `mission failed successfully :D`,
      exeption,
    });
  }
};

const deleteList = async (req, res) => {
  try {
    const lId = Number(req.body.lId);

    const removeTasksRes = await removeTasksByListId(lId);
    if (removeTasksRes) {
      const result = await removeList(lId);
      if (result) {
        res.send({
          status: 200,
          msg: `list ${lId} is removed successfully`,
        });
      } else console.error("something went wrong while deleting list");
    } else console.error("something went wrong while deleting sub tasks");
  } catch (exeption) {
    res.send({
      status: 400,
      smg: `failed to delete`,
      exeption,
    });
  }
};

module.exports = {
  getUsersListsWithTasks,
  createList,
  deleteList,
};
