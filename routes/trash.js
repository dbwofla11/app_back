var express = require('express');
var router = express.Router();
const trash_Service = require("../service/trash_can");

router.post('/trash/add', trash_Service.add_trashcan);

router.patch('/trash/update/delete', );

router.patch('/trash/update/status', trash_Service.review_trashcan );

router.get('/trash/select/all', );

router.get('/trash/select/id', );

module.exports = router;