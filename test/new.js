const virusDb = require("../");
// Initialize database
// 💡 By default, A "db.json" file will be created in root directory
(async () => {
const db = await virusDb(__dirname + "/bad.bd.json");

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

const users = await db("users").read(
  { name: "anyName" },
  {
    omit: ["password", "email"],
  }
);

console.log(users)
	})()