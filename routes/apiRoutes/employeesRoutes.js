const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// GET request to get employees
router.get('/employees', (req, res) => {
    const sql = `SELECT * FROM employees`;

    db.query(sql, (e, employees) => {
        if (e) {
            res.status(400).json({error: e.message});
            return;
        }

        res.json({employees});
    });
});

// GET request to get a specific employee
router.get('/employee/:id', (req, res) => {
    const sql = `SELECT * FROM employees WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (e, employee) => {
        if (e) {
            res.status(400).json({error: e.message});
            return;
        };

        res.json({employee});
    })
});

// POST request to add an employee
router.post('/employee', ({body}, res) => {
    const sql = `INSERT INTO employees (id, first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?, ?)`;
    const params = [body.id, body.first_name, body.last_name, body.role_id, body.manager_id];

    db.query(sql, params, (e) => {
        if (e) {
            res.status(400).json({error: e.message});
            return;
        }

        res.json({
            message: 'employee created',
            data: body
        });
    });
});

// DELETE request to delete an employee
router.delete('/employee/:id', (req, res) => {
    const sql = `DELETE FROM employees WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (e, qRes) => {
        if (e) {
            res.status(400).json({error: res.message});
        } else if (!qRes.affectedRows) {
            res.json({message: 'employee not found'});
        } else {
            res.json({
                message: 'employee deleted',
                changes: qRes.affectedRows,
                id: req.params.id
            });
        }
    })
});

module.exports = router;