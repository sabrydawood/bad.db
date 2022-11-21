module.exports = async function out(main) {
  const readline = require("readline");
  console.log("\n".repeat(process.stdout.rows));
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  const $badDb = require("../");
  main($badDb, console.log);
};
