import cron from 'node-cron';
import fs from 'fs';
import pool from '../config/db.js'; 
import moment from 'moment-timezone';

const zonaHoraria = 'America/La_Paz';

cron.schedule('07 17 * * *', async () => {
    const horaLocal = moment.tz(zonaHoraria).format('YYYY-MM-DD HH:mm:ss');
    console.log(`Iniciando la tarea de copia de seguridad de la base de datos a las ${horaLocal} (hora local)`);

    try {
        const [rows] = await pool.query("SHOW TABLES");

        const backupData = JSON.stringify(rows);
        const filePath = `backups/backup_${new Date().toISOString().split('T')[0]}.json`;
        
        fs.writeFileSync(filePath, backupData);

        console.log(`Copia de seguridad completada y guardada en ${filePath}`);
    } catch (error) {
        console.error('Error durante la copia de seguridad:', error);
    }
});
