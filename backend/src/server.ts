import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import registrationRoutes from './routes/registration.js';
import chatRoutes from './routes/chat.js';
import { initializeGemini } from './services/gemini.js';
import { connectDatabase } from './config/database.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

initializeGemini();

connectDatabase().catch((err) => {
  console.warn('⚠️  MongoDB connection failed, using in-memory storage:', err.message);
});

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://reg-site.onrender.com',
    /\.vercel\.app$/,
  ],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', registrationRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`
  🚀 Server is running!
  
  📍 Local:   http://localhost:${PORT}
  📍 API:     http://localhost:${PORT}/api
  
  🔑 Environment: ${process.env.NODE_ENV || 'development'}
  `);
});

export default app;
