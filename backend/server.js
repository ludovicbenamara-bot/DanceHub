const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 3001; // Frontend usually 5173

app.use(cors());
app.use(bodyParser.json());

// Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.send('Dance Marketplace API is Running');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
