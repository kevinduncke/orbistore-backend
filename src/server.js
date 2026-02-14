import 'dotenv/config';
import http from 'http';
import app from './app.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Orbistore backend running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});