//==============================================================================
// ■ badDb (badDb/index.js)
//------------------------------------------------------------------------------
//     Main entry point.
//==============================================================================
const fileProvider = require("./core/file");
const collectionProvider = require("./core/collection");
const crudProvider = require("./core/crud/");
const { isEmpty } = require("./utils/type");

//------------------------------------------------------------------------------
// ► Exports
//------------------------------------------------------------------------------
module.exports = badDb;

//------------------------------------------------------------------------------
// ● badDb-Main
//------------------------------------------------------------------------------
async function badDb(filePath = "./bad.json") {
  const file = fileProvider(filePath);
  let dataObj = await file.load();
  if (isEmpty(dataObj)) await file.save(dataObj);
  const db = (collectionName) => dbApi(collectionName, dataObj, file.save);
  db.file = file;
  db.dataObj = dataObj;
  db.drop = async () => {
    dataObj = {};
    file.save(dataObj);
  };
  return db;
}

//------------------------------------------------------------------------------
// ● Db-Api
//------------------------------------------------------------------------------
function dbApi(collectionName, dataObj, save) {
  const collection = collectionProvider(collectionName, dataObj, save);
  return crudProvider(collection);
}
