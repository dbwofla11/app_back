const db = require('../config/db/db');
const { execute } = require('../utils/dbQuery');

// DB에 쿼리 보내기 
module.exports = {
    
    insert_user : async (user_email, user_pw, user_nickname, salt) => { // 회원가입 
        let queryString = `insert into users(user_email, user_pw, user_nickname, salt, point) 
        value ("${user_email}" , "${user_pw}" , "${user_nickname}", "${salt}", 0)`; 
        return execute(queryString);
    },


    get_user_by_email : async (user_email) => { 
        let queryString = `select * from users where user_email = "${user_email}"`;
        result = await execute(queryString);
        return result[0][0];
    },
    
    get_user_by_refreshToken : async (refreshToken) => {
        let queryString = `select * from users where refreshToken="${refreshToken}"`;
        result = await execute(queryString);
        return result[0][0];
    },

    update_user_pw : (user_id, user_pw, salt) => {
        let queryString = `update users set user_pw = "${user_pw}", salt = "${salt}" where id = "${user_id}"`;
        return execute(queryString);
    },

    update_user_point : (user_id, point) => { // 유저에게 포인트 주는거 
        let queryString = `update users set point = ${point} where id = "${user_id}"`;
        return execute(queryString);
    },

    update_refreshToken : (user_email, refreshToken) => {
        let queryString = `update users set refreshToken = "${refreshToken}" where user_email = "${user_email}"`;
        return execute(queryString);
    },
    
    update_user_delete_cnt : (user_email ,  del_cnt)  => { // delete 용 카운트 업데이트 
        let queryString = `update users set del_cnt = ${del_cnt} where user_email = "${user_email}"`;
        return execute(queryString);
    },

    update_user_add_cnt : (user_email ,  add_cnt)  => { // add 용 카운트 업데이트 
        let queryString = `update users set add_cnt = ${add_cnt} where user_email = "${user_email}"`;
        return execute(queryString);
    },

    update_user_review_cnt : (user_email ,  review_cnt)  => { // review 용 카운트 업데이트 
        let queryString = `update users set review_cnt = ${review_cnt} where user_email = "${user_email}"`;
        return execute(queryString);
    },
    
    delete_user : (user_email) => { // 회원 삭제 
        let queryString = `delete from users where user_email = "${user_email}"` ;
        return execute(queryString);
    }
   
}