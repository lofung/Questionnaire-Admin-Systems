const Pool = require("pg").Pool;

require("pg").types.setTypeParser(1114, function(stringValue) {
    console.log(stringValue);
    return new Date(Date.parse(stringValue + "+0000"));
})

const pool = new Pool({
    user: "postgres",
    password: "z0h3T0WC84KLoN0I",
    host: "tonelessly-contiguous-terrapin.data-1.use1.tembo.io",
    port: 5432,
    database: "postgres",
    dateStrings : true,
    ssl: {
        rejectUnauthorized : false
    }
});

module.exports = pool;

//TEMBO Connecting to Postgres with Nodejs
//https://tembo.io/docs/getting-started/postgres_guides/connecting-to-postgres-with-nodejs

//BD connectior elephantSQL to TEMBO migration
//https://forum.bubble.io/t/db-connector-elephantsql-and-tembo/335792

//adding ssl to pg.pool in later stages for tembo
//https://stackoverflow.com/questions/22301722/ssl-for-postgresql-connection-nodejs