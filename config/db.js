import mysql from 'mysql2/promise'; 
import dotenv from 'dotenv';
//import fs from 'fs';

dotenv.config();

const pool = mysql.createPool({ 
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // ssl: {
    //     rejectUnauthorized: false // false para desactivar la verificación de certificado
    //    // ca: fs.readFileSync('./config/mysql-ca.pem'),
    // }
});

const pruebaConeccion = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Conexión exitosa a MySQL 🚀");
        connection.release();
    } catch (error) {
        console.error("Error al conectar con la base de datos: ", error);
    }
};

pruebaConeccion();
export default pool;
