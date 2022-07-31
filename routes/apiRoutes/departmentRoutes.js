const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// GET request to get departments
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM departments`;

    db.query(sql, (e, departments) => {
        if (e) {
            res.status(400).json({error: e.message});
            return;
        }

        res.json({departments});
    });
});

// GET request to get specific department by id
router.get('/department/:id', (req, res) => {
    const sql = `SELECT * FROM departments WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (e, departments) => {
        if (e) {
            res.status(400).json({error: e.message});
            return;
        };

        res.json({departments});
    })
});

// POST request to add a department
router.post('/department', ({body}, res) => {
    const sql = `INSERT INTO departments (name) VALUES (?)`;
    const params = [body.name];

    db.query(sql, params, (e) => {
        if (e) {
            res.status(400).json({error: e.message});
            return;
        }

        res.json({
            message: 'department created',
            data: body
        });
    });
});

// DELETE request to delete a department
router.delete('/department/:id', (req, res) => {
    const sql = `DELETE FROM departments WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (e, qRes) => {
        if (e) {
            res.statusMessage(400).json({error: res.message});
        } else if (!qRes.affectedRows) {
            res.json({message: 'Department not found'});
        } else {
            res.json({
                message: 'department deleted',
                changes: qRes.affectedRows,
                id: req.params.id
            });
        }
    })
});

module.exports = router;