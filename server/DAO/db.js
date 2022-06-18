"use strict";

const sqlite = require("sqlite3");

exports.db = new sqlite.Database("database.db", (err) => {
  if (err) throw err;
});
