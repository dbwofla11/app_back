const db = require('../config/db/db');
const { execute } = require('../utils/dbQuery');

module.exports = {
	trash_can : { 		
		get_by_id : async (id) => { // id를 이용한 쓰레기통 정보 조회 필요여부 = ? 
			
			let queryString = `select trash_name , detail from trash_can where id = ${id}`;
			result = await execute(queryString);
			return result[0][0];
		},

		get_location_all : async () => { // 처음단계에서 다 로딩하기 필요여부 = ㅇ
			let queryString = `select * from trash_can`;
			result = await execute(queryString);
			return result
		} ,

		get_trash_can_delete_point : async (id) => { // delete_point 가져와서 업데이트 할 때 씀 
			let queryString = `select \`delete_point\` from trash_can where id = ${id}`;
			result = await execute(queryString);
			return result[0][0]
		}, 

		// 쓰레기통 데이터 추가
		insert_new_location : (address, latitude, longitude, kind, full_status, trash_name , author , detail) => { //add 기능은 이미 구현 됨 
 			let queryString = `
			insert into trash_can 
			value (null, "${address}" , "${kind}", "${full_status}", "${latitude}", "${longitude}", 0 , "${trash_name}" , "${author}" , "${detail}" )`; // 0 은 삭제요청 횟수 
			
			return execute(queryString);
		},

		update_trash_can_status : (id , full_status , detail) => { // 선택한 오브젝트의 id는 계속유지 되어서 여기까지 가야됨 id 받아오는 것을 추가해야 될듯 ? 
			let queryString = `update trash_can set full_status = "${full_status}" , detail = "${detail}" where id = "${id}" `;
			return execute(queryString);
		},

		update_trash_can_deletepoint : (id , delete_point) => {
			let queryString = `update trash_can set status = "${delete_point}" where id = "${id}" `;
			return execute(queryString);
		},
		
		delete_trash_can : (id) => {
			let queryString = `delete from trash_can where id = ${id}`; // 삭제 쿼리
			return execute(queryString); // service 에서 delete 할때 중간에 넣기 
		}
	
	}
}