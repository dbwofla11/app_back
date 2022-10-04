require('dotenv').config();
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const { secretKey, option } = require('../config/jwtSecret');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

module.exports = {
	jwt_sign : async (user) => {
		const payload = {
			"http://localhost:3000/auth" : true,
			email : user.email,
			nickname : user.nickname,
		};
		const result = {
			token : jwt.sign(payload, secretKey, option),
			refreshToken : randToken.uid(256)
		};
		return result;
	},
	jwt_verify : async (token) => {
		let decoded;
		try {
			decoded = jwt.verify(token, secretKey)
		} catch (err) {
			if (err.message === 'jwt expired') {
                console.log('expired token');
                return TOKEN_EXPIRED;
            } else if (err.message === 'invalid token') {
                console.log('invalid token');
                console.log(TOKEN_INVALID);
                return TOKEN_INVALID;
            } else {
                console.log("invalid token");
                return TOKEN_INVALID;
            }
		}
		return decoded;
	}
}