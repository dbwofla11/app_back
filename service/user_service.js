const Users = require('../models/users').user;
const mailer = require('../config/email_config');
const { createHashedPassword } = require('../utils/hash');
const { generate_tokens, verify_jwt } = require('../utils/jwt_service');
require("dotenv").config();

module.exports = {
	check_duplicated : async (req, res) => {
		// 중복회원 검사
		const user = await Users.get_user_by_email(req.body.user_email);
		if (user)
			return res.status(403).json({result : false, message : "이미 가입한 이메일입니다."});
		else
			return res.json({result : true, message : "회원가입이 가능한 이메일입니다."});
	},
	
	validate_email : (req, res) => {
		let user_email = req.body.user_email;
		let transporter = mailer.smtpTransport();
		let maxNum = 999999;
		let minNum = 111111;
		
		// minNum <= authNum <= maxNum
		let authNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
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
		const { hashedPassword, salt } = await createHashedPassword(req.body.user_pw);
		await Users.insert_user(req.body.user_email, hashedPassword, req.body.user_nickname, salt);
		return res.status(201).json({result: true, message: "회원가입에 성공하였습니다."})
	},
	
	login : async (req, res) => {
		const user = await Users.get_user_by_email(req.body.user_email);
		const { hashedPassword } = await createHashedPassword(req.body.user_pw, user.salt);
		if (user.user_pw === hashedPassword) {
			const { accessToken, refreshToken } = await generate_tokens(req.body.user_email); // token 발급
			await Users.update_refreshToken(req.body.user_email, refreshToken);
			res.cookie('accessToken', accessToken);
			res.cookie('refreshToken', refreshToken);
			return res.json({
				result : true,
				message : "로그인에 성공하였습니다."
			});
		};
		return res.status(401).json({
			result : false, 
			message : "이메일 또는 비밀번호가 잘못되었습니다."
		});
	},

	get_info : async (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		const user = await Users.get_user_by_email(user_email);
		return res.json({
			email : user.user_email,
			nickname : user.user_nickname,
			point : user.point
		});
	},

	compare_pw : async (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		const user = await Users.get_user_by_email(user_email);
		const { hashedPassword } = await createHashedPassword(req.body.user_pw, user.salt);
		if (hashedPassword ===  user.user_pw) {
			return res.status(200).json({
				message : "비밀번호 인증에 성공하였습니다."
			});
		};
		return res.status(403).json({
			message : "비밀번호 인증 실패"
		});
	},

	change_pw : async (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		const user = await Users.get_user_by_email(user_email);
		const {hashedPassword, salt} = await createHashedPassword(req.body.user_pw);
		await Users.update_user_pw(user.id, hashedPassword, salt);
		return res.json({
			message : "비밀번호가 변경되었습니다."
		});
	},
	
	logout : (req, res) => {
		res.cookie('accessToken', '');
		res.cookie('refreshToken', '');
		res.json({message : 'logout success'});
	},

	withdraw_member : async (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		await Users.delete_user(user_email);
		return res.json({ message : 'Deleted user successfully' });
	},

	update_point : async (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		const user = await Users.get_user_by_email(user_email);
		const point = user.point + req.body.add_point;
		await Users.update_user_point(user.id, point);
		return res.json({
			message : "포인트가 변경되었습니다.",
			point : point
		});
	}
}