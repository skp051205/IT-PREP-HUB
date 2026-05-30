const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const resultRoutes = require('./routes/results');

app.use('/auth', authRoutes);
app.use('/questions', questionRoutes);
app.use('/results', resultRoutes);

// Home Route
app.get('/', (req, res) => {
    res.json({ 
        message: 'IT Prep Hub Server Running!',
        version: '1.0.0'
    });
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});