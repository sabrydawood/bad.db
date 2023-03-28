//==============================================================================
// ■ Compare (compare.js)
//------------------------------------------------------------------------------
//     Object comparison utility functions.
//==============================================================================

//------------------------------------------------------------------------------
// ● Exports
//------------------------------------------------------------------------------
module.exports = {
  comparePrimitives,
  isMatch,
  matches,
  isPartialMatch,
  partiallyMatches,
};

//------------------------------------------------------------------------------
// ● Compare-Primitives
//------------------------------------------------------------------------------
function comparePrimitives(valueA, valueB, options = {}) {
  const { trim = false, ignoreCase = false } = options;
  if (typeof valueA === typeof valueB) {
    if (typeof valueA === "string") {
      if (trim) {
        valueA = valueA.trim();
        valueB = valueB.trim();
      }
      if (ignoreCase) {
        valueA = valueA.toUpperCase();
        valueB = valueB.toUpperCase();
      }
    }
    return valueA === valueB;
  }
  return false;
}

//------------------------------------------------------------------------------
// ● Is-Match
//------------------------------------------------------------------------------
function isMatch(obj, query, options) {
  for (const prop in query) {
    if (!comparePrimitives(obj[prop], query[prop], options)) {
      return false;
    }
  }
  return true;
}

//------------------------------------------------------------------------------
// ● Matches
//------------------------------------------------------------------------------
function matches(query, options) {
  return (obj) => isMatch(obj, query, options);
}

//------------------------------------------------------------------------------
// ● Is-Partial-Match
//------------------------------------------------------------------------------
function isPartialMatch(obj, query, options) {
  for (const prop in query) {
    if (comparePrimitives(obj[prop], query[prop], options)) {
      return true;
    }
  }
  return false;
}

//------------------------------------------------------------------------------
// ● Partially-Matches
//------------------------------------------------------------------------------
function partiallyMatches(query, options) {
  return (obj) => isPartialMatch(obj, query, options);
}
