const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// Production Security & Performance Middleware
app.use(helmet());
app.use(compression());
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Middleware
app.use(cors({
    origin: isProduction ? process.env.FRONTEND_URL : 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

if (isProduction) {
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Auth API is running in Development mode...');
    });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
