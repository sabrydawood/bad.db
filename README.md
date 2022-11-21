# bad.db

[![NPM version](https://badge.fury.io/js/bad.db.svg)](https://npmjs.org/package/bad.db)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)



Simple JSON file based database with easy querying interface and common utilities.

> For whatever reason, If you don't want to use a real database, and instead simply use a file. but also want some query and utility functions of a database. this is **bad.db** 😁.

👇 example :

```js
db("users").create({ name: "virus", email: "virus@old.com" });
db("users").read({ name: "virus" });
db("users").update({ name: "virus" }, { email: "virus@new.com" });
db("users").delete({ name: "virus" });
```
**bad.db** is constituted of **four** (`create`, `read`, `update`, and `delete`) methods that represents the **CRUD** operations and **three** (or less) parameters (`item`, `query`, and `options`) considerably (more or less) recurring in the four methods.

<!-- toc -->

- [📥 Installation](#%F0%9F%93%A5-installation)
- [🏁 Getting Started](#%F0%9F%8F%81-getting-started)
- [🚩 Initialize](#%F0%9F%9A%A9-initialize)
- [🔎 Query](#%F0%9F%94%8E-query)
- [☑️ Options](#%E2%98%91%EF%B8%8F-options)
- [💠 CREATE](#%F0%9F%92%A0-create)
  * [☑️ CREATE Options](#%E2%98%91%EF%B8%8F-create-options)
  * [CREATE Examples](#create-examples)
- [READ](#read)
  * [☑️ READ Options](#%E2%98%91%EF%B8%8F-read-options)
  * [READ Examples](#read-examples)
- [UPDATE](#update)
  * [☑️ UPDATE Options](#%E2%98%91%EF%B8%8F-update-options)
  * [UPDATE Examples](#update-examples)
- [DELETE](#delete)
  * [☑️ DELETE Options](#%E2%98%91%EF%B8%8F-delete-options)
  * [DELETE Examples](#delete-examples)
- [↘️ Other](#%E2%86%98%EF%B8%8F-other)
- [📃 License](#%F0%9F%93%83-license)

<!-- tocstop -->

## 📥 Installation

```bash
npm i bad.db
yarn add bad.db
```

## 🏁 Getting Started

👇 Learn by a simple common example :

```js
// Require library
const virusDb = require("bad.db");

// Initialize database
// 💡 By default, A "db.json" file will be created in root directory
const db = await virusDb();

// Create a new item within a collection named "users"
// 💡 If the collection doesn't exist it will be created automatically
// 💡 With the utility option "encrypt", the "password" field
//    will be saved as an encrypted hash string instead of the original
const createdUser = await db("users").create(
  {
    name: "anyName",
    email: "anyEmail@email.com",
    password: "secret123",
  },
  {
    encrypt: "password",
  }
);

// Read all items from "users" collection where "name" is "anyName"
// 💡 The "omit" option hides the "password" and "email"
//    fields in the returned results
const users = await db("users").read(
  { name: "anyName" },
  {
    omit: ["password", "email"],
  }
);

// Update all "users" items where "name" is "anyName"
// with new values for "email" and "password"
const updatedUser = await db("users").update(
  { name: "anyName" },
  {
    email: "anyEmail@NewEmail.com",
    password: "NEW_SECRET_123456789",
  }
);

// Delete all "users" items where "email" is "anyEmail@NewEmail.com"
const deletedUser = await db("users").update({ email: "anyEmail@NewEmail.com" });
```

💡 A JSON file named `bad.json` (by default) is created in the root directory. This is an example of its content :

```json
{
  "users": [
    {
      "name": "virus",
      "email": "virus@example.com",
      "$id": "8c8f128e-4905-4e77-b664-e03f6de5e952",
      "$createdAt": "2021-09-05T21:40:27Z"
    },{
      "name": "kenza",
      "email": "kenza@example.com",
      "$id": "8c8f128e-4905-4e77-b664-e03f6de5e952",
      "$createdAt": "2021-09-05T21:40:27Z"
    },
    {
      "name": "ambratolm",
      "email": "ambratolm@example.com",
      "$id": "5211133c-a183-4c99-90ab-f857adf5442a",
      "$createdAt": "2002-11-01T22:12:55Z",
      "$updatedAt": "2021-10-02T00:00:00Z"
    }
  ]
}
```

💡 Note that the `$id` and `$createdAt` fields are created automatically when an item is created, and `$updatedAt` when it is updated.

## 🚩 Initialize

```js
// Initialize with a "db.json" file in the root directory
const db = await badDb();

// Initialize with a custom named JSON file in the root directory
const db = await badDb("my-database-file.json");

// Initialize with a custom named JSON file in the current directory
const db = await badDb(__dirname + "/my-database-file");
```

## 🔎 Query

Query parameter in `Read`, `Update`, and `Delete` methods is an object or function that allows targeting specific items in collection.

- Query object :

```
{
  fieldName: fieldValue,
  fieldName: fieldValue,
  ...etc
}
```

Query object is an object of property values to match against collection items.<br />
A comparison is performed between every item object property values in collection and the query object property values to determine if an item object contains equivalences.<br />
The items containing the equivalences are returned.

Example:
```js
const queryObj = {
  firstName: "virus",
  age: 20,
  rating: 5
};

const users = await db("users").read(queryObj);
```

- Query function :

```
(item, index?, collection?) => [Boolean]
```

Query function is a predicate called for every item when iterating over items of collection.<br />
All items predicate returns truthy for are returned.<br />
The predicate is invoked with three arguments :
- `value` : **Required**. The value of the current item.
- `index` : _Optional_. The index of the current item in collection.
- `collection` : _Optional_. The collection array-object the current item belongs to.

Example:

```js
const queryFn = (user) => {
  return user.name.startsWith("v") && user.age >= 20 && rating >= 5;
};

const users = await db("users").read(queryFn);
```

## ☑️ Options

```
{
  optionName: optionValue,
  optionName: optionValue,
  ...etc
}
```

Options parameter in **all** methods is an object that allows to apply additional stuff to the method's subject item or to the method's returned items result.<br />
Every method can have specific options or common options depending on the context of the method.

Example :

```js
const options = {
  unique: ["name", "email"],
  encrypt: "password",
  omit: ["email", "password"],
  nocase: true
};

const user = {
  name: "moulay-elhassan",
  email: "hassona@example.com",
  password: "secret#hassona?1980"
}

const createdUser = await db("users").create(user, options);
```

## 💠 CREATE

```js
await db(collectionName).create(item?, options?);
```

Creates a new item in a collection.<br />
💡 If the specified collection doesn't exist it will be created automatically.<br />
💡 If no item object is specified (omitted, `null`, or `undefined`), an empty item is created with no fields except the system fields (with names starting with $ sign).<br />
💡 The created item is returned.

| Parameter      | Type   | Default | Description                             |
| -------------- | ------ | ------- | --------------------------------------- |
| collectionName | String |         | Targeted collection name                |
| item           | Object | {}      | Item to create                          |
| options        | Object | {}      | CREATE options                          |
| **@returns**   | Object |         | The created item                        |
| **@throws**    | Error  |         | If a unique field value is already used |
| **@throws**    | Error  |         | If a value to encrypt is not a string   |

### ☑️ CREATE Options

| Property | Type               | Default | Description                      |
| -------- | ------------------ | ------- | -------------------------------- |
| unique   | String or String[] | ""      | Fields to declare as unique      |
| encrypt  | String or String[] | ""      | Fields to encrypt                |
| pick     | String or String[] | ""      | Fields to pick in returned items |
| omit     | String or String[] | ""      | Fields to omit in returned items |
| nocase   | Boolean            | false   | If true ignores case in search   |

💡 When fields are declared as `unique`, a checking for duplicates is done before adding the item.

💡 If `nocase` is true, letter case comparison will be ignored in search operations, like for example checking `unique` values.

###  CREATE Examples

```js
// Create an item within a collection named "players" (automatically created)
// The created item is returned
const createdPlayer = await db("players").create({
  name: "virus",
  level: 99,
  inventory: ["sword", "shield", "potion"],
});

// Create an item within a collection named "players" with some options
const createdPlayer = await db("players").create(
  {
    name: "virus",
    level: 99,
    inventory: ["sword", "shield", "potion"],
    password: "this_is_a_secret",
  },
  {
    // Options
    unique: "name", // Make "name" field unique
    encrypt: "password", // Encrypt "password" field
    omit: ["password", "level"], // Omit fields in the returned item object
    nocase: true, // Ignore case when comparing strings
  }
);
```

##  READ

```js
await db(collectionName).read(query?, options?);
```

Reads an existing item in a collection.<br />
💡 If the specified collection doesn't exist it will be created automatically.<br />
💡 If no query is specified (omitted, `null`, or `undefined`), the query defaults to empty query `{}` which returns all items.<br />
💡 The read items are returned.

| Parameter      | Type   | Default | Description                       |
| -------------- | ------ | ------- | --------------------------------- |
| collectionName | String |         | Targeted collection name          |
| query          | Object | {}      | Query object or function          |
| options        | Object | {}      | READ options                      |
| **@returns**   | Array  |         | The read item                     |
| **@throws**    | Error  |         | If an encrypted field not matched |

### ☑️ READ Options

| Property | Type               | Default | Description                        |
| -------- | ------------------ | ------- | ---------------------------------- |
| one      | Boolean            | false   | Return only one result (Object)    |
| pick     | String or String[] | []      | Fields to pick in returned items   |
| omit     | String or String[] | []      | Fields to omit in returned items   |
| nocase   | Boolean            | false   | Ignore case in search              |
| sort     | String or String[] | ""      | Fields to sort by returned items   |
| order    | String or String[] | "asc"   | Order of sorting of returned items |
| encrypt  | String or String[] | []      | Fields to encrypt                  |
| limit    | Number             | MAX     | Number of returned items           |
| page     | Number             | 0       | Index of pagination (with limit)   |
| expand   | String             | ""      | Name of collection to expand to    |
| embed    | String             | ""      | Name of collection to embed        |

###  READ Examples

```js
// Read all items in "players" collection
const players = await db("players").read();

// Read items matching a query object
const somePlayers = await db("players").read({ name: "virus" });

// Read items matching a query function
const someOtherPlayers = await db("players").read(
  (player) => player.level >= 90
);

// Read items matching a query with some options
const player = await db("players").read(
  { name: "virus" },
  {
    // Options
    nocase: true, // Ignore case when comparing strings
    one: true, // return only one result (an object instead of array)
  }
);
```

##  UPDATE

```js
await db(collectionName).update(query?, changes?, options?);
```

Updates an existing item in a collection.<br />
💡 If the specified collection doesn't exist it will be created automatically.<br />
💡 If no query is specified (omitted, `null`, or `undefined`), no item is updated.<br />
💡 If an empty query `{}` is specified, all items are updated.
💡 If no changes are specified (omitted, `null`, or `undefined`), the changes default to empty changes `{}` which only updates the `$updatedAt` field in targeted items.
💡 The updated items are returned.

| Parameter      | Type   | Default | Description                             |
| -------------- | ------ | ------- | --------------------------------------- |
| collectionName | String |         | Targeted collection                     |
| query          | Object | {}      | Query object or function                |
| changes        | Object | {}      | Changes to apply                        |
| options        | Object | {}      | Additional options                      |
| **@returns**   | Array  |         | The updated item                        |
| **@throws**    | Error  |         | If Items matching query not found       |
| **@throws**    | Error  |         | If a unique field value is already used |
| **@throws**    | Error  |         | If a value to encrypt is not a string   |

### ☑️ UPDATE Options

| Property | Type               | Default | Description                       |
| -------- | ------------------ | ------- | --------------------------------- |
| total    | Boolean            | false   | If true overrides all item fields |
| one      | Boolean            | false   | Return only one result (Object)   |
| unique   | String or String[] | ""      | Fields to declare as unique       |
| encrypt  | String or String[] | []      | Fields to encrypt                 |
| pick     | String or String[] | []      | Fields to pick in returned items  |
| omit     | String or String[] | []      | Fields to omit in returned items  |
| nocase   | Boolean            | false   | Ignore case in search             |

###  UPDATE Examples

```js
// Update item(s)
// The updated item is returned
const updatedPlayer = await db("players").update(
  { name: "virus" }, // Query can also be a function
  { name: "new name", level: 0 } // Changes to apply
);

// Update item(s) with some options
const updatedPlayer = await db("players").update(
  { name: "virus" }, // Query can also be a function
  { name: "new name", level: 0 }, // Changes to apply
  {
    // Options
  }
);
```

##  DELETE

```js
await db(collectionName).delete(query?, options?);
```

Deletes an existing item in a collection.<br />
💡 If the specified collection doesn't exist it will be created automatically.<br />
💡 If no query is specified (omitted, `null`, or `undefined`), no item is deleted.<br />
💡 If an empty query `{}` is specified, all items are deleted.<br />
💡 The deleted items are returned.

| Parameter      | Type   | Default | Description                       |
| -------------- | ------ | ------- | --------------------------------- |
| collectionName | String |         | Targeted collection name          |
| query          | Object | {}      | Query object or function          |
| options        | Object | {}      | Additional options                |
| **@returns**   | Object |         | The deleted item                  |
| **@throws**    | Error  |         | If Items matching query not found |

### ☑️ DELETE Options

| Property | Type               | Default | Description                      |
| -------- | ------------------ | ------- | -------------------------------- |
| one      | Boolean            | false   | Return only one result (Object)  |
| pick     | String or String[] | []      | Fields to pick in returned items |
| omit     | String or String[] | []      | Fields to omit in returned items |
| nocase   | Boolean            | false   | Ignore case in search            |

###  DELETE Examples

```js
// Delete item(s)
// The deleted item is returned
const deletedPlayer = await db("players").delete(
  { name: "virus" } // Query can also be a function
);

// Delete item(s) with some options
const deletedPlayer = await db("players").delete(
  { name: "virus" }, // Query can also be a function
  {
    // Options
  }
);
```

## ↘️ Other

```js
// Remove all collections
await db.drop();

// Remove a collection named "players"
await db("players").drop();

// Remove all items in a collection named "players" and keep it
await db("players").clear();
```

## 📃 License

[MIT](./LICENSE) © [Virus24](https://github.com/virgel1995)
