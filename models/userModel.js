// src/models/userModel.js
import db from '../config/db.js';

export const getUserByEmail = async (correo) => {
    const connection = await db.getConnection(); 
    try {
        const [rows] = await connection.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    } finally {
        connection.release(); 
    }
};
