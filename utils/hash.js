const crypto = require('crypto');

module.exports = {
	createSalt : () =>
    new Promise((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    }),

 createHashedPassword : (plainPassword) =>
    new Promise(async (resolve, reject) => {
        const salt = await createSalt(); // 소금 만들어서 대입
        crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ user_pw: key.toString('base64'), salt });
        });
    })
}