var express = require('express');
var router = express.Router();
const {check_tokens} = require('../utils/auth');
const User_Service = require("../service/user_service");

router.post('/login', User_Service.login); // req.body : user_id, user_pw

// 먼저 email 입력 페이지로부터 email만 입력받아 db에 중복된 email이 있는지 검사.
router.post('/register', User_Service.check_duplicated); // req.body : user_email 

// 인증 페이지로부터 email을 전송받은 후, user_email과 client로 인증번호를 보냄.
// user의 입력과 client가 받은 값이 똑같으면(이건 client에서 검증) 그 다음 페이지(비밀번호, 닉네임 입력 폼)로 넘어감. 
router.post('/register-validate-email', User_Service.validate_email); // req.body : req.body user_email

// user_nickname 중복검사
router.post('/register-validate-nickname', User_Service.validate_nickname);

// email, pw, nickname을 전달받아 db에 insert.
router.post('/register-process', User_Service.register_user); // req.body : user_email, user_pw, user_nickname

router.get('/info', check_tokens, User_Service.get_info); // req.body : 없음.

// 현재 비밀번호 입력후 같은지 검사.(구현완료)
router.post('/validate-pw', check_tokens, User_Service.compare_pw);

// 새로운 비밀번호를 쳐서 서버한테 보내는 방식.(구현완료)
router.patch('/update/pw', check_tokens, User_Service.change_pw); // req.body : user_pw(새로운 비밀번호)

// 1. 포인트의 변화량만 앱에서 서버로 전송(구현 완료)
router.patch('/update/point', check_tokens, User_Service.update_point); // req.body : addPoint(포인트 변화량)

router.delete('/delete', check_tokens, User_Service.withdraw_member); // req.body : 없음.

router.get('/logout', check_tokens, User_Service.logout); // req.body : 없음.

module.exports = router;