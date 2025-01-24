import mysql, {PoolOptions} from 'mysql2/promise';

const config: PoolOptions = {
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE,
    connectionLimit:10,
    port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections:true,

}

export const DB = mysql.createPool(config);