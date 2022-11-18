const jwt = require('jsonwebtoken');
const { accessSecretKey, refreshSecretKey, accessOption, refreshOption, get_payload } = require('../config/jwt_secret');

module.exports = {
	generate_tokens :  (user_email) => {
		const payload = get_payload(user_email);

		return {
			accessToken : jwt.sign(payload, accessSecretKey, accessOption),
			refreshToken : jwt.sign(payload, refreshSecretKey, refreshOption)
		};
	},
	update_jwt : (user_email, kind) => {
		let payload = get_payload(user_email);

		if (kind === "refresh") {
			const refreshToken = jwt.sign(payload, refreshSecretKey, refreshOption); // refreshToken 생성

			console.log('updated refreshToken successfully.');
			return refreshToken;
		} else if (kind === "access") {
			const accessToken = jwt.sign(payload, accessSecretKey, accessOption); // accesshToken 생성

			console.log('updated accessToken successfully');
			return accessToken;
		} else {
			throw new Error("error in update tokens");
		}
		
	},
	verify_jwt :  (token, kind) => {
		let decoded;
		const TOKEN_EXPIRED = -1;
		const TOKEN_INVALID = -2;

		try {
			if (kind === "access"){
				decoded = jwt.verify(token, accessSecretKey);
			} 
			else if (kind === "refresh") {
				decoded = jwt.verify(token, refreshSecretKey);
			} 
			else { throw new Error("Unknown Type of Token") }
		} catch (err) {
			console.log(err.message);
			if (err.message === 'jwt expired') {
                return TOKEN_EXPIRED;
            } 
			else {
                return TOKEN_INVALID;
            }
		}
		return decoded;
	}
}