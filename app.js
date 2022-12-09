const oracledb = require('oracledb');
require('dotenv').config()
var pool = null
try {
    oracledb.initOracleClient({ libDir: 'C:\\Users\\jose\\Downloads\\instantclient-basiclite-windows.x64-21.7.0.0.0dbru\\instantclient_21_7' });
} catch (err) {
    console.error('Whoops!');
    console.error(err);
    process.exit(1);
}


async function getPool(con) {
    console.log(con)
    return new Promise(async (resolve, reject) => {
        if (pool) resolve(pool)
        try {
            console.log("obtengo pool")
            pool = await oracledb.createPool(con)
            resolve(pool)
        } catch (error) {
            reject(error)
        }
    });
}

async function q(sql, parametros) {
    let connection;
    try {
        await getPool({
            user: process.env.ORACLE_USER, password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CN, poolAlias: "curso"
        })
        connection = await oracledb.getConnection("curso");
        const result = await connection.execute(
            sql,
            parametros, { outFormat: oracledb.OBJECT },
        );
        console.log(result.rows)
        return (result.rows);
    } catch (err) {

        throw err;
    } finally {

        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                return err;
            }
        }
    }
}

q("select * from customers", [])
    .then(r => console.log)
    .catch(e => {
        console.log(e)
    })