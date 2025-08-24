require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('../routes');
const { sequelize } = require('../models');
const { router: authRouter, requireAuth } = require('../auth');
const { createAdminTable } = require('./models/AdminUser');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Serve static files from public/images directory (for default images)
app.use('/images', express.static(path.join(__dirname, '..', '..', 'public', 'images')));

// Health check
app.get('/', (req, res) => {
  res.send('Admin backend running');
});

// Favicon route to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.use('/api/auth', authRouter);
app.use('/api', apiRoutes);

sequelize.sync().then(async () => {
  // Initialize admin table
  await createAdminTable();
  
  app.listen(port, () => {
    console.log(`Admin backend listening on port ${port}`);
  });
});
