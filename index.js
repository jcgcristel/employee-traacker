const db = require('./db/connection');
const {main} = require('./utils/app');

// Connect to database
db.connect(e => {
    if (e) throw e;

    console.log('Connected.');

    main();
});