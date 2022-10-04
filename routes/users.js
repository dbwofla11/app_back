var express = require('express');
var router = express.Router();

const { authenticate } = require('../service/jwt_service');
const hash_pw = require('../utils/hash');

const User_Service = require("../service/user_service");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post('/login', (req, res) => {
	User_Service.login(req, res);
})

// 먼저 email 입력 페이지로부터 email만 입력받아 db에 중복된 email이 있는지 검사.
router.post('/register', (req, res) => {
	let user_email = req.body.user_email;
	User_Service.check_duplicated(user_email, res);
})

// 인증 페이지로부터 email을 전송받은 후, user_email과 client로 인증번호를 보냄.
// user의 입력과 client가 받은 값이 똑같으면(이건 client에서 검증) 그 다음 페이지(비밀번호, 닉네임 입력 폼)로 넘어감. 
router.post('/register-validate-email', (req, res) => {
	let user_email = req.body.user_email;
	User_Service.validate_email(user_email, res);
})

// email, pw, nickname을 전달받아 db에 insert.
router.post('/register-process', async (req, res) => {
	let user_email = req.body.user_email;
	let user_nickname = req.body.user_nickname;
	let plainPassword = req.body.user_pw;
	const { hashedPassword, salt } = await hash_pw.createHashedPassword(plainPassword);
	User_Service.insert_user_db(user_email, hashedPassword, user_nickname, salt, res); // db에 salt column 추가
})

router.get('/delete', (req, res) => {
	// delete
})

router.get('/logout', (req, res) => {
	// logout
})

router.post('/update-stamp', (req, res) => {
	// update stamp
})


module.exports = router;
