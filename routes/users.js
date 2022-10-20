var express = require('express');
var router = express.Router();
const hash_pw = require('../utils/hash');
const {check_tokens} = require('../utils/auth');
const User_Service = require("../service/user_service");

router.post('/login', User_Service.login);

// 먼저 email 입력 페이지로부터 email만 입력받아 db에 중복된 email이 있는지 검사.
router.post('/register', User_Service.check_duplicated);

// 인증 페이지로부터 email을 전송받은 후, user_email과 client로 인증번호를 보냄.
// user의 입력과 client가 받은 값이 똑같으면(이건 client에서 검증) 그 다음 페이지(비밀번호, 닉네임 입력 폼)로 넘어감. 
router.post('/register-validate-email', User_Service.validate_email);

// email, pw, nickname을 전달받아 db에 insert.
router.post('/register-process', User_Service.register_user);

router.patch('/update/pw', check_tokens, User_Service.change_pw);

router.patch('/update/point', check_tokens, User_Service.update_point);

router.delete('/delete', check_tokens, User_Service.withdraw_member);

router.get('/logout', check_tokens, User_Service.logout);

module.exports = router;