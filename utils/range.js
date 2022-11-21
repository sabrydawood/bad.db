//==============================================================================
// ■ Range (range.js)
//------------------------------------------------------------------------------
//     Range Management utility functions.
//==============================================================================
const { reject, remove, orderBy } = require("lodash");
const { partiallyMatches } = require("./compare");

//------------------------------------------------------------------------------
// ► Exports
//------------------------------------------------------------------------------
module.exports = {
  /* Non-native */ reject,
  /* Non-native */ remove,
  /* Non-native */ orderBy,
  alreadyInUse,
  paginate,
  filterAndMap,
};

//------------------------------------------------------------------------------
// ● Already-In-Use
//------------------------------------------------------------------------------
function alreadyInUse(arr, query, options) {
  return arr.findIndex(partiallyMatches(query, options)) >= 0;
}

//------------------------------------------------------------------------------
// ● Paginate
//------------------------------------------------------------------------------
function paginate(arr = [], limit, page) {
  if (!limit && !page) {
    return arr;
  }
  limit = Number(limit);
  page = Number(page);
  if (isNaN(limit)) {
    limit = 10;
  }
  if (isNaN(page)) {
    page = 1;
  }
  if (page <= 0) {
    page = 1;
  }
  if (limit <= 0) {
    limit = 1;
  }
  if (limit > arr.length) {
    limit = arr.length;
  }
  const start = (page - 1) * limit;
  const end = (page - 1) * limit + limit;
  return arr.slice(start, end);
}

//------------------------------------------------------------------------------
// ● Filter-And-Map
//------------------------------------------------------------------------------
function filterAndMap(arr = [], filterFn, mapFn) {
  if (typeof filterFn !== "function") {
    throw new Error("filterFn must be a function");
  }
  if (typeof mapFn !== "function") {
    throw new Error("mapFn must be a function");
  }
  return arr.reduce((stack, item) => {
    if (filterFn(item)) stack.push(mapFn(item));
    return stack;
  }, []);
}
