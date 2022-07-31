const express = require('express');
const db = require('./db/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Start server after connection to database
db.connect(e => {
    if (e) throw e;

    console.log('Connected');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});