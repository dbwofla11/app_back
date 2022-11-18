const Users = require('../models/users');
const mailer = require('../config/email_config');
const { createHashedPassword } = require('../utils/hash');
const { generate_tokens, verify_jwt } = require('../utils/jwt_service');
const { delete_trash_can_by_author } = require('../models/trash_can_location');

module.exports = {
	check_duplicated : async (req, res) => {
		const user = await Users.get_user_by_email(req.body.user_email);

		if (user) return res.status(403).json({result : false, message : "이미 가입한 이메일입니다."});
		else      return res.json({result : true, message : "회원가입이 가능한 이메일입니다."});
	},
	
	validate_email : (req, res) => {
		const user_email = req.body.user_email;
		const transporter = mailer.smtpTransport();
		const maxNum = 999999;
		const minNum = 111111;
		
		// minNum <= authNum <= maxNum
		const authNum = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
		const mailOptions = mailer.mailOptions(user_email, authNum);

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

	validate_nickname : async (req, res) => {
		const user = await Users.get_user_by_nickname(req.body.user_nickname);
		if (user) return res.status(403).json({ message : "이미 사용중인 닉네임입니다." });
		else      return res.json({ message : "사용 가능한 닉네임입니다." });
	},
	
	register_user : async (req, res) => {
		const user = Users.get_user_by_email(req.body.user_email);

		if (req.body.user_pw.length < 8) 
			return res.status(400).json({ message : "비밀번호는 8자 이상으로 입력해주세요"});

		if (await user)
			return res.status(403).json({ message: "이미 가입하셨습니다." });

		const { hashedPassword, salt } = await createHashedPassword(req.body.user_pw);

		await Users.insert_user(req.body.user_email, hashedPassword, req.body.user_nickname, salt);

		return res.status(201).json({result: true, message: "회원가입에 성공하였습니다."});
	},
	
	login : async (req, res) => {
		const user_email = req.body.user_email.trim();
		req.body.user_email = user_email;
		const user = await Users.get_user_by_email(req.body.user_email);

		if (!user) return res.status(403).json({ result : false, message : "이메일 또는 비밀번호가 잘못되었습니다." });

		const { hashedPassword } = await createHashedPassword(req.body.user_pw, user.salt);

		if (user.user_pw === hashedPassword) {
			const { accessToken, refreshToken } = generate_tokens(req.body.user_email); // token 발급

			await Users.update_refreshToken(req.body.user_email, refreshToken);

			res.cookie('accessToken', accessToken);
			res.cookie('refreshToken', refreshToken);

			return res.json({
				result : true,
				message : "로그인에 성공하였습니다."
			});
		}

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
			point : user.point,
			add_cnt : user.add_cnt,
			del_cnt : user.del_cnt,
			review_cnt : user.review_cnt
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
		res.cookie('accessToken', '', { maxAge : 0 });
		res.cookie('refreshToken', '', { maxAge : 0 });
		res.json({message : '로그아웃하셨습니다.'});
	},

	withdraw_member : async (req, res) => {
		const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
		const user = await Users.get_user_by_email(user_email);

		await delete_trash_can_by_author(user.id);

		await Users.delete_user(user_email);

		return res.json({ message : '회원 탈퇴 성공' });
	},
	
	logout : (req, res) => {
		res.cookie('accessToken', '', { maxAge : 0 });
		res.cookie('refreshToken', '', { maxAge : 0 });
		res.json({message : '로그아웃하셨습니다.'});
	},
}