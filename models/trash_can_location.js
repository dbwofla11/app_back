const db = require('../config/db/db');
const { execute } = require('../utils/dbQuery');

module.exports = {
			
	get_by_id : async (id) => { // id를 이용한 쓰레기통 정보 조회 필요여부 = ? 
		let queryString = `select * from trash_can where id = ${id}`;
		result = await execute(queryString);
		return result[0][0];
	},

	get_location_all : async () => { // 처음단계에서 다 로딩하기 필요여부 = ㅇ
		let queryString = `select * from trash_can`;
		result = await execute(queryString);
		return result[0];
	},

	get_trash_can_delete_point : async (id) => { // delete_point 가져와서 업데이트 할 때 씀 
		let queryString = `select delete_point from trash_can where id = ${id}`;
		result = await execute(queryString);
		return result[0][0].delete_point;
	}, 

	get_trash_can_author : async (id) => { // 쓰레기통 id로 작성자 불러오기 
		let queryString = `select author from trash_can where id = ${id}`;
		result = await execute(queryString);
		return result[0][0];
	},

	get_author_point : async (trash_id) => { // 유저아이디랑 작성자 찾아서 포인트 get 
        let queryString = `select users.* from users 
		inner join trash_can
		on trash_can.author = users.id 
		where trash_can.id = "${trash_id}"`;
        result = await execute(queryString);
		return result[0][0];
    },

	// 쓰레기통 데이터 추가
	insert_new_location : (address, latitude, longitude, kind, full_status, trash_name , author , detail) => { //add 기능은 이미 구현 됨 
		let queryString = `
		insert into trash_can 
		(address , kind , full_status , latitude , longitude , del_point , trash_name , author , detail) 
		value ("${address}" , ${kind}, ${full_status}, ${latitude}, ${longitude}, 0 , 
		"${trash_name}" , "${author}" , "${detail}" )`; // 0 은 삭제요청 횟수 
		
		return execute(queryString);
	},

	update_trash_can_status : (id , full_status , detail) => { // 선택한 오브젝트의 id는 계속유지 되어서 여기까지 가야됨 id 받아오는 것을 추가해야 될듯 ? 
		let queryString = `update trash_can set full_status = ${full_status} , detail = "${detail}" where id = ${id} `;
		return execute(queryString);
	},

	update_trash_can_deletepoint : (id , delete_point) => {
		let queryString = `update trash_can set status = ${delete_point} where id = ${id} `;
		return execute(queryString);
	},
	
	delete_trash_can : (id) => {
		let queryString = `delete from trash_can where id = ${id}`; // 삭제 쿼리
		return execute(queryString); // service 에서 delete 할때 중간에 넣기 
	},
	/**x y 으로 쓰레기통 가져오기 x1 왼쪽 x2 오른쪽 , y1 위 y2 아래**/
	get_trash_by_xy : async (x1 , x2 , y1 , y2) => {
		let queryString = `select * from trash_can 
		where((${x1} < longitude and longitude < ${x2}) and (${y1} < latitude and latitude < ${y2}) )`;
		result = await execute(queryString);
		return result[0]; // 여러개를 받을 때 하나만 해줌 
	},
	
}