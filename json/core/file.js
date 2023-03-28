//==============================================================================
// ■ File-Provider (file.js)
//------------------------------------------------------------------------------
//     File system IO logic wrapper.
//==============================================================================
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

//------------------------------------------------------------------------------
// ► Exports
//------------------------------------------------------------------------------
module.exports = fileProvider;

//------------------------------------------------------------------------------
// ● File-Provider
//------------------------------------------------------------------------------
function fileProvider(filePath) {
  return {
    path: filePath,
    load: async () => _load(filePath),
    save: async (data) => _save(filePath, data)
  };
};

//------------------------------------------------------------------------------
// ● Load
//------------------------------------------------------------------------------
async function _load(filePath) {
  try {
    const dataJson = await readFile(filePath, "utf-8");
    return JSON.parse(dataJson);
  } catch(error) {
    if (error.code !== "ENOENT") throw Error(error);
    return {};
  }
}

//------------------------------------------------------------------------------
// ● Save
//------------------------------------------------------------------------------
async function _save(filePath, dataObj) {
  const dataJson = JSON.stringify(dataObj, null, 2);
  if (dataJson === undefined) throw Error("Invalid data JSON format.");
  return writeFile(filePath, dataJson, "utf-8");
}
