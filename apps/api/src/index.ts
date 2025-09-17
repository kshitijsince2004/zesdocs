import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initializeDatabase, getDatabaseHealth } from './db/connection';
import authRoutes from './routes/auth';
import linksRoutes from './routes/links';
import internalRoutes from './routes/internal';
import searchRoutes from './routes/search';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/links', linksRoutes);
app.use('/internal', internalRoutes);
app.use('/search', searchRoutes);

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealth = await getDatabaseHealth();
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: dbHealth,
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Zesdocs API',
    version: '1.0.0',
    status: 'running',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Zesdocs API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize database connection
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.error('❌ Failed to initialize database. Server may not function correctly.');
  }
});

export default app;