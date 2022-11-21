//==============================================================================
// ■ UPDATE (update.js)
//------------------------------------------------------------------------------
//     UPDATE opeation for database CRUD operations.
//=============================================================================
const { isObject, isFunction, isString, isEmpty } = require("../../utils/type");
const { matches } = require("../../utils/compare");
const { reject, alreadyInUse } = require("../../utils/range");
const { pick, omit } = require("../../utils/convert");
const { encrypt } = require("../../utils/crypt");

//------------------------------------------------------------------------------
// ● Exports
//------------------------------------------------------------------------------
module.exports = $update;

//------------------------------------------------------------------------------
// ● UPDATE-Opeation
//------------------------------------------------------------------------------
async function $update(collection, query, changes = {}, options = {}) {
  const {
    total: totalUpdate,
    one: oneItem,
    unique: fieldsToUniquify,
    encrypt: fieldsToEncrypt,
    pick: fieldsToPick,
    omit: fieldsToOmit,
    nocase: ignoreCase,
  } = options;
  let items = collection.filter(_query(query, options));
  // if (items.length === 0) {
  //   throw Error(
  //     `Items matching [${JSON.stringify(query)}] not found in collection [${
  //       collection.name
  //     }]`
  //   );
  // }
  for (const item of items) {
    if (fieldsToUniquify) {
      if (
        alreadyInUse(
          reject(collection, _query(query, options)),
          pick(changes, fieldsToUniquify),
          {
            ignoreCase,
          }
        )
      ) {
        throw new Error(
          `Could not update item [${JSON.stringify(item)}] in [${
            collection.name
          }] collection because [${fieldsToUniquify}] unique fields values are already in use`
        );
      }
    }
    if (fieldsToEncrypt) {
      for (const field of fieldsToEncrypt) {
        if (!isString(item[field])) {
          throw new Error(
            `Could not encrypt [${field}: ${item[field]}] field value because it is not a string `
          );
        }
        item[field] = await encrypt(item[field]);
      }
    }
    const systemFields = {
      $id: item.$id,
      $createdAt: item.$createdAt,
      $updatedAt: new Date().toISOString(),
    };
    if (totalUpdate) {
      for (const key in item) {
        if (Object.keys(changes).includes(key)) {
          item[key] = changes[key];
        } else {
          item[key] = undefined;
        }
      }
    } else {
      Object.assign(item, changes);
    }
    Object.assign(item, systemFields);
  }
  await collection.save();
  for (const [index, item] of items.entries()) {
    items[index] = fieldsToPick
      ? pick(item, fieldsToPick)
      : omit(item, fieldsToOmit);
  }
  return oneItem ? items[0] || {} : items;
}

//------------------------------------------------------------------------------
// ● Helpers
//------------------------------------------------------------------------------
function _query(query, options) {
  const { nocase: ignoreCase } = options;
  if (query) {
    if (isObject(query)) {
      return matches(query, { ignoreCase });
    } else if (isFunction(query)) {
      return query;
    }
  }
  return () => false;
}