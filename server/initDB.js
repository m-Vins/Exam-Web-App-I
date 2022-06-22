/***
 *  run this script to clean all the db and store only the default users
 */
const sqlite = require("sqlite3");
const fs = require("fs");

async function main() {
  const SQL = fs.readFileSync("./database.sql", "ascii");
  console.log(SQL);

  db = new sqlite.Database("database.db", (err) => {
    if (err) throw err;
  });

  await db.exec(SQL, function (err) {
    if (err) console.log(err);
    else
      console.log(
        "Database correctly cleaned\nOnly default user are now available"
      );
  });
}

main();
