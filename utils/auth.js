const { verify_jwt, update_jwt } = require('./jwt_service');
const Users = require('../models/users');

module.exports = {
    check_tokens : async (req, res, next) => {
        const user = Users.get_user_by_refreshToken(req.cookies.refreshToken);

        if (req.cookies === undefined)
            return res.status(401).json({ message : '사용권한이 없습니다.' });

        // db에 있는 refreshToken과 cookie에 있는 refreshToken을 비교
        await user;
        if (!user)
            return res.status(401).json({ message : "사용권한이 없습니다."});

        let accessToken = verify_jwt(req.cookies.accessToken, 'access');
        let refreshToken = verify_jwt(req.cookies.refreshToken, 'refresh');

        // 0. accessToken 또는 refreshToken가 invalid
        if (accessToken === -2 || refreshToken === -2) {
            return res.status(401).json({
                result : false,
                message : "invalid token is detected."
            });
        }

        if (accessToken === -1) {
            if (refreshToken === -1) { // 1. accessToken과 refreshToken 모두 만료
                return res.status(401).json({
                    result : false,
                    message : "Tokens are already expired. Goto login page."
                });
            } else { // 2. accessToken 만료, refreshToken 유효
                let user_email = refreshToken.email;
                let accessToken = update_jwt(user_email, 'access');

                req.cookies.accessToken = accessToken;
                res.cookie('accessToken', accessToken);
            }
        } else {
            if (refreshToken === -1) { // 3. accessToken 유효, refreshToken 만료
                let user_email = accessToken.email;

		    	refreshToken = update_jwt(user_email, "refresh"); // refreshToken 생성

                await Users.update_refreshToken(user_email, refreshToken);
                
                req.cookies.refreshToken = refreshToken;
                res.cookie('refreshToken', refreshToken);
            } 
            // 4. accessToken 유효 및 refreshToken 유효시 아무것도 안함.
        }
        next();
    }
}