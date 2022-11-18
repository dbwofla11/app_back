const nodemailer = require('nodemailer');

module.exports = {
    mailOptions : (user_email, authNum) => {
        return {
            from: process.env.EMAIL_ID,
            to: user_email,
            subject: '\'쓰레기통 어딨지?\'의 회원가입을 위해 인증번호를 입력해주세요.',
            text: `인증번호 : ${authNum}`,
        };
    },
    smtpTransport : () => {
        return nodemailer.createTransport({
            service: "Naver",
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PW
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    } 
}