import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const corsOptions = {
    origin: "http://localhost:5173"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/v1/health/status", (req, res) => {
    res.json({
        message: "success"
    });
});

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