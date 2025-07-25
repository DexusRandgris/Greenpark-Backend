require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const authRoutes = require('./src/routes/authRoutes'); // Ruta para usuarios
const mailRoutes = require('./src/routes/mailRoutes'); // Ruta para correos
const bookRoutes = require('./src/routes/bookRoutes'); // Ruta para libros
const cursosRoutes = require('./src/routes/cursosRoutes'); // Ruta para cursos
const messagesRoutes = require('./src/routes/messagesRoutes');

// Configuración CORS
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'https://greenpark-yjxi.onrender.com',
  'https://greenpark1.netlify.app',
  'https://greenparkacademia.com'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origen (postman, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `El CORS no permite el acceso desde el origen: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware para responder a OPTIONS antes de las rutas (preflight)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204); // No Content
  }
  next();
});

// Middleware para parsear JSON
app.use(express.json());

// Ruta pública para acceder a PDFs u otros archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/mail', mailRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/mensajes', messagesRoutes);

// Middleware para loguear peticiones (opcional para debug)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Puerto y servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error("Error capturado por middleware:", err.message || err);
  res.status(500).json({ mensaje: "Error interno del servidor", error: err.message || err });
});
