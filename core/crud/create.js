//==============================================================================
// ■ CREATE (create.js)
//------------------------------------------------------------------------------
//     CREATE opeation for database CRUD operations.
//=============================================================================
const { generateId } = require("../../utils/id");
const { encrypt } = require("../../utils/crypt");
const { pick, omit } = require("../../utils/convert");
const { alreadyInUse } = require("../../utils/range");
const { isString } = require("../../utils/type");

//------------------------------------------------------------------------------
// ► Exports
//------------------------------------------------------------------------------
module.exports = $create;

//------------------------------------------------------------------------------
// ● CREATE-Opeation
//------------------------------------------------------------------------------
async function $create(collection, item = {}, options = {}) {
  const {
    unique: fieldsToUniquify,
    encrypt: fieldsToEncrypt,
    pick: fieldsToPick,
    omit: fieldsToOmit,
    nocase: ignoreCase
  } = options;
  if (fieldsToUniquify) {
    if (
      alreadyInUse(collection, pick(item, fieldsToUniquify), { ignoreCase })
    ) {
      throw new Error(
        `Could not create item [${JSON.stringify(item)}] in [${
          collection.name
        }] collection because [${fieldsToUniquify}] unique fields values are already in use`
      );
    }
  }
  if (fieldsToEncrypt) {
    for (const field in pick(item, fieldsToEncrypt)) {
      if (!isString(item[field])) {
        throw new Error(
          `Could not encrypt [${field}: ${JSON.stringify(item[field])}] field value because it is not a string`
        );
      }
      item[field] = await encrypt(item[field]);
    }
  }
  item.$id = generateId();
  item.$createdAt = (new Date()).toISOString();
  collection.push(item);
  await collection.save();
  return fieldsToPick ? pick(item, fieldsToPick) : omit(item, fieldsToOmit);
}
