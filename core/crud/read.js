//==============================================================================
// ■ READ (read.js)
//------------------------------------------------------------------------------
//     READ opeation for database CRUD operations.
//=============================================================================
const { isObject, isFunction, isEmpty } = require("../../utils/type");
const { matches } = require("../../utils/compare");
const { filterAndMap, paginate, orderBy } = require("../../utils/range");
const { pick, omit, expand, embed } = require("../../utils/convert");
const { check } = require("../../utils/crypt");

//------------------------------------------------------------------------------
// ● Exports
//------------------------------------------------------------------------------
module.exports = $read;

//------------------------------------------------------------------------------
// ● READ-Opeation
//------------------------------------------------------------------------------
async function $read(collection, query = {}, options = {}) {
  const { one: oneItem } = options;
  let items = await _decrypt(collection, query, options);
  items = _filterAndMap(items, query, options);
  items = _orderBy(items, options);
  items = _paginate(items, options);
  items = _expandOrEmbed(items, collection.name, options);
  return oneItem ? items[0] : items;
}

//------------------------------------------------------------------------------
// ● Helpers
//------------------------------------------------------------------------------
function _filterAndMap(items, query, options = {}) {
  const {
    pick: fieldsToPick,
    omit: fieldsToOmit,
    nocase: ignoreCase,
  } = options;
  let pickOrOmit = (item) => item;
  if (fieldsToPick) {
    pickOrOmit = (item) => pick(item, fieldsToPick);
  } else if (fieldsToOmit) {
    pickOrOmit = (item) => omit(item, fieldsToOmit);
  }
  if (isObject(query)) {
    return filterAndMap(items, matches(query, { ignoreCase }), pickOrOmit);
  } else if (isFunction(query)) {
    return filterAndMap(items, query, pickOrOmit);
  } else {
    return items.filter(() => true);
  }
}
//------------------------------------------------------------------------------
function _orderBy(items, options = {}) {
  const { sort: fieldsToSortBy, order: ordersToSortBy } = options;
  return orderBy(items, fieldsToSortBy, ordersToSortBy);
}
//------------------------------------------------------------------------------
async function _decrypt(items, query, options = {}) {
  const { encrypt: fieldsToDecrypt } = options;
  if (!isEmpty(fieldsToDecrypt)) {
    const queryToDecrypt = pick(query, fieldsToDecrypt);
    omit(query, fieldsToDecrypt, true);
    const matchedItems = [];
    for (const item of items) {
      let itemMatched = false;
      for (const key in queryToDecrypt) {
        if (item[key]) {
          itemMatched = await check(queryToDecrypt[key], item[key]);
        }
      }
      if (itemMatched) {
        matchedItems.push(item);
      }
    }
    return matchedItems;
  }
  return items;
}
//------------------------------------------------------------------------------
function _paginate(items, options = {}) {
  const { limit: perPage, page: pageNumber } = options;
  return paginate(items, perPage, pageNumber);
}
//------------------------------------------------------------------------------
function _expandOrEmbed(items, collectionName, options = {}) {
  const { expand: expandCollectionName, embed: embedCollectionName } = options;
  if (expandCollectionName) {
    items = items.map((item) => expand(item, expandCollectionName));
  }
  if (embedCollectionName) {
    items = items.map((item) =>
      embed(item, collectionName, embedCollectionName)
    );
  }
  return items;
}
