//==============================================================================
// ■ DELETE (delete.js)
//------------------------------------------------------------------------------
//     DELETE opeation for database CRUD operations.
//=============================================================================
const { isObject, isFunction } = require("../../utils/type");
const { remove } = require("../../utils/range");
const { matches } = require("../../utils/compare");
const { pick, omit } = require("../../utils/convert");

//------------------------------------------------------------------------------
// ● Exports
//------------------------------------------------------------------------------
module.exports = $delete;

//------------------------------------------------------------------------------
// ● DELETE-Opeation
//------------------------------------------------------------------------------
async function $delete(collection, query, options = {}) {
  const {
    one: oneItem,
    pick: fieldsToPick,
    omit: fieldsToOmit,
    nocase: ignoreCase
  } = options;
  let items = [];
  if (query) {
    if (isObject(query)) {
      items = remove(collection, matches(query, { ignoreCase }));
    } else if (isFunction(query)) {
      items = remove(collection, query);
    }
  }
  // if (items.length === 0) {
  //   throw new Error(
  //     `Items matching [${query}] not found in collection [${collection.name}]`
  //   );
  // }
  await collection.save();
  for (let [index, item] of items.entries()) {
    items[index] = fieldsToPick
      ? pick(item, fieldsToPick)
      : omit(item, fieldsToOmit);
  }
  return oneItem ? items[0] : items;
}
