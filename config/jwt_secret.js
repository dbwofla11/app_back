require('dotenv').config();

module.exports = {
    accessSecretKey : process.env.ACCESS_TOKEN_SECRET, // access token secret key
    refreshSecretKey : process.env.REFRESH_TOKEN_SECRET,  // refresh token secret key
    accessOption : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "30m",  // 토큰 유효 기간
        issuer : "trash_can_locaition_app" // 발행자
    },
    refreshOption : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "14d",  // 토큰 유효 기간
        issuer : "trash_can_locaition_app" // 발행자
    },
    get_payload : (user_email) => {
        return {
            'localhost:3000/auth' : true, // public claim
            email : user_email, // private claim
        }
    }
}