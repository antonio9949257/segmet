import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import './tasks/backupTask.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/auth', authRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

app.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server corriendo en el puerto ${process.env.PORT}`);
});