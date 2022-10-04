// 회원가입, 로그인
const Users = require('../models/users').user;
const smtpTransport = require('../config/email_config');
const { createHashedPassword } = require('../utils/hash');
const { jwt_sign } = require('./jwt_service');
require("dotenv").config();

module.exports = {
	check_duplicated : (user_email, res) => {
		// 중복회원 검사
		Users.get_user(user_email, (rows) => {
			if (rows[0][0]) return res.json({result: false, message: "이미 가입한 이메일입니다."});
			else return res.json({result : true, message : "회원가입이 가능한 이메일입니다."});
		})
	},
	
	validate_email : (user_email, res) => {
		let transporter = smtpTransport;
		
		// 111111 <= authNum <= 999999
		let authNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

		let mailOptions = {
			from: process.env.EMAIL_ID,
			to: user_email,
			subject: '쓰레기통 위치 앱의 회원가입을 위한 인증번호를 입력해주세요.',
			text: `인증번호 : ${authNum}`,
		};

		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				throw err;
			}
			console.log("Finish sending email : " + info.response);
			transporter.close();
		});
		res.json({authNum : authNum});
	},
	
	insert_user_db : (user_email, user_pw, user_nickname, salt, res) => {
		Users.insert_user(user_email, user_pw, user_nickname, salt, (rows) => {
			return res.json({result: true, message: "회원가입에 성공하였습니다."})
		})
	},
	
	login : (req, res) => {
		let user_email = req.body.user_email;
		let user_pw = req.body.user_pw;
		Users.get_user(user_email, async (rows) => {
			if (!rows[0][0]) { 
				return res.json({
					result: false, 
					message: "이메일 또는 비밀번호가 잘못되었습니다."
				});
			}
			else {
				let user = rows[0][0];
				const { hashedPassword, salt } = await createHashedPassword(user_pw, user.salt);
				if (user.user_pw === hashedPassword) {
					const tokens_json = await jwt_sign(user); // token 발급
					return res.json({
						result : tokens_json,
						message : "로그인에 성공하였습니다."
					});
				} else {
					return res.json({
						result: false, 
						message: "이메일 또는 비밀번호가 잘못되었습니다."
					});
				}
			}
		})
	}
}