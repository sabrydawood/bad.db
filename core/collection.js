//==============================================================================
// ■ Collection-Provider (collection.js)
//------------------------------------------------------------------------------
//     Collection extraction logic.
//==============================================================================

//------------------------------------------------------------------------------
// ► Exports
//------------------------------------------------------------------------------
module.exports = collectionProvider;

//------------------------------------------------------------------------------
// ● Collection-Provider
//------------------------------------------------------------------------------
function collectionProvider(collectionName, dataObj, save) {
  return _getCollection(collectionName, dataObj, save);
}

//------------------------------------------------------------------------------
// ● Get-Collection
//------------------------------------------------------------------------------
function _getCollection(collectionName, dataObj, save) {
  let collection = dataObj[collectionName];
  if (!collection) {
    collection = dataObj[collectionName] = [];
  }
  collection.name = collectionName;
  collection.dataObj = dataObj;
  collection.save = async () => save(dataObj);
  return collection;
}
