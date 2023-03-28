//==============================================================================
// ■ Convert (convert.js)
//------------------------------------------------------------------------------
//     Type conversion utility functions.
//==============================================================================
const { singularize } = require("i")();
const { isString, isArray } = require("./type");

//------------------------------------------------------------------------------
// ► Exports
//------------------------------------------------------------------------------
module.exports = {
  pick,
  omit,
  /* Non-native */ singularize,
  stringToArray,
  expand,
  embed,
};

//------------------------------------------------------------------------------
// ● Pick
//------------------------------------------------------------------------------
function pick(obj = {}, fields = [], mutate = false) {
  if (!mutate) {
    obj = { ...obj };
  }
  if (isArray(fields)) {
    for (const key in obj) {
      if (!fields.includes(key)) {
        delete obj[key];
      }
    }
  } else {
    for (const key in obj) {
      if (key !== fields) {
        delete obj[key];
      }
    }
  }
  return obj;
}

//------------------------------------------------------------------------------
// ● Omit
//------------------------------------------------------------------------------
function omit(obj = {}, fields = [], mutate = false) {
  if (!mutate) {
    obj = { ...obj };
  }
  if (isString(fields)) {
    const field = fields;
    for (const key in obj) {
      if (key === field) {
        delete obj[key];
      }
    }
  } else if (isArray(fields)) {
    for (const key in obj) {
      if (fields.includes(key)) {
        delete obj[key];
      }
    }
  }
  return obj;
}

//------------------------------------------------------------------------------
// ● String-To-Array
//------------------------------------------------------------------------------
function stringToArray(value) {
  return value ? (Array.isArray(value) ? value : [value]) : [];
}

//------------------------------------------------------------------------------
// ● Expand
//------------------------------------------------------------------------------
function expand(obj = {}, query = {}) {
  const {
    localField = "someId",
    foreignField = "id",
    foreignArray = [],
    newField = `${localField}_expandation`,
  } = query;
  const item = { ...obj };
  item[newField] = foreignArray.find(
    (foreignItem) => foreignItem[foreignField] === item[localField]
  );
  return item;
}

//------------------------------------------------------------------------------
// ● Embed
//------------------------------------------------------------------------------
function embed(obj = {}, query = {}) {
  const {
    localField = "id",
    foreignField = "someId",
    foreignArray = [],
    newField = "embedment",
    count = false,
  } = query;
  const item = { ...obj };
  const result = foreignArray.filter(
    (foreignItem) => foreignItem[foreignField] === item[localField]
  );
  item[newField] = count ? result.length : result;
  return item;
}
