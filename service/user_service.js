// 회원가입, 로그인
const Users = require('../models/users').user;
const smtpTransport = require('../config/email_config');


module.exports = {
	check_duplicated : (user_email, res) => {
		// 중복회원 검사
		Users.get_user(user_email, (err, rows) => {
			if (err) throw err;
			if (rows[0]) return res.json({result: false, message: "이미 가입한 이메일입니다."});
		})
	},
	
	validate_email : (user_email, res) => {
		let transporter = smtpTransport;
		
		// 111111 <= authNum <= 999999
		let authNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

		let mailOptions = {
			from: `쓰레기통 위치 앱`,
			to: user_email,
			subject: '쓰레기통 위치 앱의 회원가입을 위한 인증번호를 입력해주세요.',
			text: `인증번호 : ${authNum}`,
		};

		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				throw err;
			}
			console.log("Finish sending email : " + info.response);
			res.send(authNum);
			transporter.close()
		});
	},
	
	insert_user_db : (user_email, user_pw, user_nickname, res) => {
		Users.insert_user(user_email, user_pw, user_nickname, (err, rows) => {
			if (err) throw err;
			else return res.json({result: true, message: "회원가입에 성공하였습니다."})
		})
	},
	
	login : (req, res) => {
		let user_email = req.body.user_email;
		let user_pw = req.body.user_pw;
		User.get_user(user_email, (err, rows) => {
			if (err) throw err;
			
			// 로그인 성공시 토큰 발급
			if (!rows[0]) return res.json({result: false, message: "아이디 또는 비밀번호가 잘못되었습니다."});
			else {
				if (rows[0].user_pw === user_pw) {
					return res.json({result: true, message: "로그인에 성공하였습니다."});
				} else {
					return res.json({result: false, message: "아이디 또는 비밀번호가 잘못되었습니다."});
				}
			}
		})
	}
}