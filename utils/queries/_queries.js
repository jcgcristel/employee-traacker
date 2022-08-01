const ctable = require('console.table');
const db = require('../db/connection');

// Display table results
const view = function(table) {
    console.log('--------------------------------------------------');
    const sql = `SELECT * FROM ${table}`;
    db.query(sql, (e, res) => {
        if (e) throw e;
        console.table(res);
        backToMain();
    })
};

// get id of a row of a table given a conditional statement
const getId = function(table, conditionName, conditionValue) {
    const sql = `SELECT id FROM ?? WHERE ?? = ? LIMIT 1`;
    const params = [table, conditionName, conditionValue];
    return new Promise((resolve, reject) => {
        db.query(sql, params, (e, res) => {
            if (e) throw e;
            // Handler if ID doesn't exist
            if (!res.length)
            {
                resolve(null);
            } else {
                // get id given a row
                resolve(res[0].id);
            }            
        });      
    });
};

// Get column of a table given its name
const getColumn = function(colummn, table) {
    const sql = `SELECT ?? FROM ??`;
    const params = [colummn, table];

    return new Promise((resolve, reject) => {
        db.query(sql, params, (e, res) => {
            if (e) throw e;
            // Array to hold values of column
            let columnArray = [];
            // Adds values from column to array
            res.map(data => columnArray.push(Object.values(data)[0]));
            resolve(columnArray);
        })
    });
};

module.exports = {view, getId, getColumn};