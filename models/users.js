const db = require('../config/db/db');
const { execute } = require('../utils/dbQuery');

// DB에 쿼리 보내기 
module.exports = {
    user : {
        insert_user : (user_email, user_pw, user_nickname, salt, cb) => {
          	let queryString = `insert into user(user_email, user_pw, user_nickname, salt, point) 
			value ("${user_email}" , "${user_pw}" , "${user_nickname}", "${salt}", 0)`; 
            execute(queryString, cb);
        },
        
        get_user_by_email : (user_email, cb) => {
    		let queryString = `select * from user where user_email = "${user_email}"`;
            execute(queryString, cb);
		},
        
        get_user_by_refreshToken : async (refreshToken, cb) => {
            let queryString = `select * from user where refreshToken="${refreshToken}"`;
            await db.promise().query(queryString)
                    .then((rows) => cb(rows))
                    .catch((err) => { throw err })
        },

        update_user_pw : (user_id, user_pw, salt, cb) => {
            let queryString = `update user set user_pw = "${user_pw}", salt = "${salt}" where id = "${user_id}"`
            execute(queryString, cb);
		},

        update_user_point : (user_id, point, cb) => {
            let queryString = `update user set point = ${point} where id = "${user_id}"`
            execute(queryString, cb);
        },

        update_refreshToken : (user_email, refreshToken, cb) => {
            let queryString = `update user set refreshToken = "${refreshToken}" where user_email = "${user_email}"`;
            execute(queryString, cb);
        },
        
        delete_user : (user_email , cb) => { // 이것역시 서비스에서 끼워넣기 
            let queryString = `delete from user where user_email = "${user_email}"` 
            execute(queryString, cb);
        }
        
    }
}




// db 정보 user 
// user 기능을 먼저 생각해보자
// user의 point 불러오기 
// user의 id 불러오기 
// pw 조회 -> 비밀번호 찾기 
// id , pw , point 
// phone_number 