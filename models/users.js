const db = require('./db/db');

// DB에 쿼리 보내기 
module.exports = {
    user : {
        insert_user : (user_email, user_pw, user_nickname, cb) => {
          	let queryString = `insert into user(user_email, user_pw, user_nickname, point) 
			value ("${user_email}" , "${user_pw}" , "${user_nickname}", 0)`; 
                
			db.connect();
            db.query(queryString, (err, rows) => {
                db.end();
				cb(err, rows);
			})
        },
        
        get_user : (user_email, cb) => {
    		let queryString = `select * from user where user_email = "${user_email}"`;
    		
			db.connect();
    		db.query(queryString, (err, rows) => {
                db.end();
                cb(err, rows);
            })
		},
        
        update_user_pw : (user_email , user_pw , cb) => {
            let queryString = `update user set user_pw = "${user_pw}" where user_email = "${user_email}"`
            
            db.connect();
            db.query(queryString, (err, rows) => {
                db.end();
                cb(err, rows);
            })
		},
        update_user_point : (user_email , point , cb) => {
            let queryString = `update user set point = ${point} where user_id = "${user_email}"`
            
            db.connect();
            db.query(queryString , (err ,rows) => {
                db.end();
                cb(err, rows);
            })
        },
        
        delete_user : (user_email , cb) => { // 이것역시 서비스에서 끼워넣기 
            let queryString = `delete from user where user_id = "${user_email}" ` 
            
            db.connect();
            db.query(queryString, (err, rows) => {
                db.end();
                cb(err, rows);
            })
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