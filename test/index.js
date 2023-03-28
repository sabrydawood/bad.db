const out = require("./out");

out(async ($badDb, log) => {
  const db = await $badDb(__dirname + "/bad");
  log(await db("users").read());
});
