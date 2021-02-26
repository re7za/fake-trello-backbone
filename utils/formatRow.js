const formatRow = function (row) {
  let { password, ...result } = row;
  return result;
};

module.exports = formatRow;
