const crypto = require('crypto');
require('dotenv').config();

createSalt = async () => {
    const buf = await crypto.randomBytes(64);
    return buf.toString("base64");
},

createHashedPassword = (plainPassword, salt) =>
    new Promise(async (resolve, reject) => {
        if (!salt) { salt = await createSalt(); }
        crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) =>{
            if (err) reject(err);
            else resolve({ hashedPassword : key.toString('base64'), salt });
        })
    })

createHashedPassword(process.env.DB_PASSWORD)
.then((s) => console.log(s))
.catch((err) => {throw err});