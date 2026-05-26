import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

import { registerUser, loginUser } from '../modules/auth/controller.js';

import { authenticateToken } from '../middleware/auth.js';

import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../modules/users/controller.js';

import { 
  createProfile, 
  getAllProfiles, 
  getProfileById, 
  updateProfile, 
  deleteProfile,
  getMyProfile
} from '../modules/biodata/controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
    origin: "http://localhost:9092"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/v1/health/status", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.post('/v1/auth/register', registerUser);
app.post('/v1/auth/login', loginUser);

app.post('/v1/users', authenticateToken, createUser);
app.get('/v1/users', authenticateToken, getAllUsers);
app.get('/v1/users/:id', authenticateToken, getUserById);
app.put('/v1/users/:id', authenticateToken, updateUser);
app.delete('/v1/users/:id', authenticateToken, deleteUser);

app.get('/v1/biodatas/me', authenticateToken, getMyProfile);
app.post('/v1/biodatas', authenticateToken, createProfile);
app.get('/v1/biodatas', authenticateToken, getAllProfiles);
app.get('/v1/biodatas/:id', authenticateToken, getProfileById);
app.put('/v1/biodatas/:id', authenticateToken, updateProfile);
app.delete('/v1/biodatas/:id', authenticateToken, deleteProfile);

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 9092;
    const server = app.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`);
    });
    server.on('error', (error) => {
        console.error("SERVER CRASHED WITH ERROR:", error);
    });
}

process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
});

export default app;