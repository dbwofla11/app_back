const db = require('../config/db/db');
const express = require('express');
const router = express.Router();

router.get('/hi', (req, res) => {
    db.promise().query(`select * from user`)
    .then((rows) => { res.send(rows[0]) })
    .catch((err) => { throw err })
})

module.exports = router;