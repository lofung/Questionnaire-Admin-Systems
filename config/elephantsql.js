const Pool = require("pg").Pool;

//this page is for connecting to postgreSQL / elephant SQL
//cannot go to github

//this line is for parsing date
//very annoying feature in js. if no need to use date, just post date-string onto database
require("pg").types.setTypeParser(1114, function(stringValue) {
    console.log(stringValue);
    return new Date(Date.parse(stringValue + "+0000"));
})

const pool = new Pool({
    user: "zmstdodq",
    password: "aYcyWP-bQXwB2fmWpz3dEG9eXTS-KC2M",
    host: "satao.db.elephantsql.com",
    port: 5432,
    database: "zmstdodq",
    dateStrings : true
});

module.exports = pool;