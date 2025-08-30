const express = require('express');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
// Configure CORS to allow multiple frontend origins and handle preflight
// Accept comma-separated origins via CLIENT_ORIGINS
const defaultOrigin = 'http://localhost:5173';
const allowedOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || defaultOrigin)
  .split(',')
  .map(o => o.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (e.g., curl/postman) with no origin
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
// Explicitly handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;