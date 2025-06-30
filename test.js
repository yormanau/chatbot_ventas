const fs = require("fs");

const json = fs.readFileSync("datos-sql-sheets-f08c11cb35b7.json", "utf8");
const jsonEscapado = JSON.stringify(JSON.parse(json)); // Escapa todo

console.log(jsonEscapado);
