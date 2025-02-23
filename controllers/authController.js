import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library'; 
import db from '../config/db.js';
import { getUserByEmail } from '../models/userModel.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI, JWT_SECRET } = process.env;

// Crea una instancia de OAuth2Client
const oauth2Client = new OAuth2Client(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI);

const getAccessToken = async (code) => {
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: OAUTH_CLIENT_ID,
            client_secret: OAUTH_CLIENT_SECRET,
            redirect_uri: OAUTH_REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        const { access_token, refresh_token, expires_in } = data;
        const expiresAt = Date.now() + (expires_in * 1000); // Calculamos la fecha de expiración

        return { accessToken: access_token, refreshToken: refresh_token, expiresAt };
    } catch (error) {
        throw new Error('Error fetching access token');
    }
};

const getUserData = async (accessToken) => {
    try {
        const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return data;
    } catch (error) {
        throw new Error('Error fetching user data from Google');
    }
};

const findOrCreateUser = async (email, name) => {
    try {
        let user = await getUserByEmail(email);
        if (!user) {
            const [result] = await db.query('INSERT INTO usuarios (nombre, correo) VALUES (?, ?)', [name, email]);
            user = { id: result.insertId, nombre: name, correo: email };
        }
        return user;
    } catch (error) {
        throw new Error('Error finding or creating user');
    }
};

const storeOAuthTokens = async (userId, accessToken, refreshToken, expiresAt) => {
    try {
        await db.query('INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at) VALUES (?, ?, ?, ?)', [userId, accessToken, refreshToken, expiresAt]);
    } catch (error) {
        throw new Error('Error storing OAuth tokens');
    }
};

const generateJwtToken = (user) => {
    return jwt.sign({ id: user.id, email: user.correo }, JWT_SECRET, { expiresIn: '1h' });
};

// Función principal para el callback de OAuth
export const oauthCallback = async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: 'Authorization code is required' });
    }

    try {
        const { accessToken } = await getAccessToken(code);
        const { email, name } = await getUserData(accessToken);
        const user = await findOrCreateUser(email, name);
        const token = generateJwtToken(user);

        // Store OAuth tokens in the database
        await storeOAuthTokens(user.id, accessToken, null, null); // Assuming no refresh token or expiry time for simplicity

        res.redirect(`http://localhost:3000/main.html?token=${token}`);

    } catch (error) {
        res.status(500).json({ message: error.message || 'Error during OAuth callback' });
    }
};

// Función para redirigir a Google OAuth
export const oauthGoogle = (req, res) => {
    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline', 
        scope: ['profile', 'email'],
        prompt: 'select_account' 
    });

    res.redirect(authorizationUrl); 
};
