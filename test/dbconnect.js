const db = require('../config/db/db');
const express = require('express');
const Users = require('../models/users').user;
const router = express.Router();

router.post('/hi', async (req, res) => {
    const user = await Users.get_user_by_email(req.body.user_email);
    console.log(user);
    res.send(user);
})

module.exports = router;