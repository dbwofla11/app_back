const Users = require('../models/users').user;
const mailer = require('../config/email_config');
const { createHashedPassword } = require('../utils/hash');
const { generate_tokens, verify_jwt } = require('../utils/jwt_service');
require("dotenv").config();

module.exports = {
	check_duplicated : (req, res) => {
		// 중복회원 검사
		Users.get_user_by_email(req.body.user_email, (rows) => {
			if (rows[0][0]) return res.status(403).json({result: false, message: "이미 가입한 이메일입니다."});
			else return res.status(200).json({result : true, message : "회원가입이 가능한 이메일입니다."});
		})
	},
	
	validate_email : (req, res) => {
		let user_email = req.body.user_email;
		let transporter = mailer.smtpTransport();
		
		// 111111 <= authNum <= 999999
		let authNum = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
		let mailOptions = mailer.mailOptions(user_email, authNum);

		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				res.status(500).json({message : err.message});
			}
			else {
				res.status(201).json({authNum : authNum});
				console.log("Finish sending email : " + info.response);
			}
			transporter.close();
		});
	},
	
	register_user : async (req, res) => {
		const { hashedPassword, salt } = await hash_pw.createHashedPassword(req.body.user_pw);
		Users.insert_user(req.body.user_email, hashedPassword, req.body.user_nickname, salt, (rows) => {
			return res.status(201).json({result: true, message: "회원가입에 성공하였습니다."});
		});
	},
	
	login : (req, res) => {
		let user_email = req.body.user_email;
		let user_pw = req.body.user_pw;
		Users.get_user_by_email(user_email, async (rows) => {
			if (rows[0][0]) {
				let user = rows[0][0];
				const { hashedPassword, salt } = await createHashedPassword(user_pw, user.salt);
				if (user.user_pw === hashedPassword) {
					const { accessToken, refreshToken } = await generate_tokens(user_email); // token 발급
					Users.update_refreshToken(user_email, refreshToken, (rows) => { 
						console.log('saved refreshToken into DB successfully.'); 
					});
					res.cookie('accessToken', accessToken);
					res.cookie('refreshToken', refreshToken);
					return res.json({
						result : true,
						message : "로그인에 성공하였습니다."
					});
				} 
			}
			return res.status(401).json({
				result : false, 
				message : "이메일 또는 비밀번호가 잘못되었습니다."
			});
		})
	},

	get_info : (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		Users.get_user_by_email(user_email, async (rows) => {
			if (!rows[0][0]) {
				return res.status(404).json({
					message : "Cannot find the user."
				});
			} else {
				let user = rows[0][0]
				return res.json({
					email : user.user_email,
					nickname : user.user_nickname,
					point : user.point
				});
			}
		});
	},

	change_pw : (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		Users.get_user_by_email(user_email, async (rows) => {
			if (!rows[0][0]) {
				return res.status(404).json({
					message : "Cannot find the user."
				})
			} else {
				let user = rows[0][0];
				const {hashedPassword, salt} = await createHashedPassword(req.body.user_pw);
				Users.update_user_pw(user.id, hashedPassword, salt, (rows) => {
					return res.status(200).json({
						message : 'passward is changed successfully.'
					});
				});
			}
		});
	},
	
	logout : (req, res) => {
			res.cookie('accessToken', '');
			res.cookie('refreshToken', '');
			res.json({message : 'logout success'});
	},

	withdraw_member : (req, res) => {
		Users.delete_user(req.body.user_email, (rows) => {
			res.json({message : 'delete user successfully'});
		});
	},

	update_point : (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		const point = req.body.point;
		Users.get_user_by_email(user_email, async (rows) => {
			if (!rows[0][0]) {
				return res.status(404).json({
					message : "Cannot find the user."
				});
			} else {
				let user = rows[0][0];
				Users.update_user_point(user.id, point, (rows) => {
					return res.status(200).json({
						message : 'point is changed successfully.'
					});
				});
			}
		});
	}
}