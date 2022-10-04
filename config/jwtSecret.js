require('dotenv').config();

module.exports = {
    secretKey : process.env.ACCESS_TOKEN_SECRET, // 원하는 시크릿 키
    option : {
        algorithm : "HS256", // 해싱 알고리즘
        expiresIn : "30m",  // 토큰 유효 기간
        issuer : "trash_can_locaition_app" // 발행자
    }
}