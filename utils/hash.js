const crypto = require('crypto');

let self = module.exports = {
	createSalt : async () => {
        const buf = await crypto.randomBytes(64);
        return buf.toString("base64");
    },

    createHashedPassword : (plainPassword, salt) =>
    new Promise(async (resolve, reject) => {
        if (!salt) { salt = await self.createSalt(); }

        crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) =>{
            if (err) reject(err);
            else     resolve({ hashedPassword : key.toString('base64'), salt : salt});
        });
    })
}