const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Router
app.use('/api', apiRoutes);

// Default error response
app.use((req, res) => {
    res.status(404).end();
})

// Start server after connection to database
db.connect(e => {
    if (e) throw e;

    console.log('\nConnected.');

    app.listen(PORT, () => {
        console.log(`\nServer running on port ${PORT}.`);
    });
});