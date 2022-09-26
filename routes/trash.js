var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// /trash/register req: {status : INT , } // 상태 디비에다 보내기 
router.post('/register', (req, res) => {	
	let status = req.status;
})

// /trash/add req: {trash_name : string , kind : int}
router.post('/add', (req, res) => {
    let trash_name = req.trash_name;
    let kind = req.kind;
})

router.get('/update-status', (req ,res) => { // 요소를 클릭해서 들어가면 get 
    
})

router.post('/delete-request', (req ,res) => {
    
})

module.exports = router;


