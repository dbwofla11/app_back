var express = require('express');
var router = express.Router();
const trash_Service = require("../service/trash_can");
const {check_tokens} = require('../utils/auth');

router.post('/trash/add', check_tokens, trash_Service.add_trashcan);

router.patch('/trash/update/delete', check_tokens, trash_Service.delete_trashcan );

router.patch('/trash/update/status', check_tokens,  trash_Service.review_trashcan );

router.get('/trash/select/all', );

router.get('/trash/select/id', );

module.exports = router;