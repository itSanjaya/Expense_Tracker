const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true,               // needed if you send cookies or auth headers
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/expenses', expenseRoutes);



app.use(errorHandler);

module.exports = app;