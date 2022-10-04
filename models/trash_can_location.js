const db = require('../config/db');

module.exports = {
	trash_can : { // 주소는 서비스에서 자르기. 
		get_by_address: (gu="", road="", detail="", cb) => { // 주소를 이용한 쓰레기통 정보 조회
			
			let queryString = `select * from trash_can `;
			if (gu != "" || road != "" || detail != "") {
				let where = [];
				queryString += `where `;
			
				if (gu != "") where.push(`gu = "${gu}" `);
				if (road != "") where.push(`road = "${road}" `);
				if (detail != "") where.push(`detail = "${detail}" `);

				queryString += where.join(`and`);
			}
			
			db.query(queryString, (err, rows) => {
				db.end();
				cb(err, rows);
			})
		},
		
		get_by_id : (id, cb) => { // id를 이용한 쓰레기통 정보 조회
			
			let queryString = `select * from trash_can where id = ${id}`;
			db.query(queryString, (err, rows) => {
				db.end();
				cb(err, rows);
			})
		},
		
		// 쓰레기통 데이터 추가
		insert_new_location : (gu, road, detail, latitude, longitude, user_id, kind, status, trash_name ,cb) => {
			
			let address_split = address.split(" ");
			let gu = address[0] + " " + address[1];
			let road = address[2];
			let detail = address.splice(3, -1);
			
 			let queryString = `
			insert into trash_can 
			value (null, "${gu}", "${road}", "${detail}", "${user_id}", "${kind}", "${status}", "${latitude}", "${longitude}", 0 , "${trash_name}" )`; // 0 은 삭제요청 횟수 
			
			db.query(queryString, (err, rows) => {
				db.end();
				cb(err, rows);
			})
		},
		
		update_trash_can : (id, inputDict, cb) => { // 쓰레기 통 상태 동기화 , 신고횟수 업데이트
			
			let queryString = `update trash_can set `;
			for (var key in inputDict) {
				if (inputDict[key] != "") {
					if (typeof(inputDict[key]) == "string") {
						queryString += `${key} = "${inputDict[key]}", `;
					} else if (typeof(inputDict[key]) == "number") {
						queryString += `${key} = ${inputDict[key]}, `;
					}
				}
			}
			
			queryString[-2] = "";
			queryString += `where id = ${id}`;
			
			db.query(queryString, (err, rows) => {
				db.end();
				cb(err, rows);
			})
		},
		
		delete_trash_can : (id, cb) => {
			
			let deleteString = `delete from trash_can where id = ${id}`; // 삭제 쿼리
			
			db.query(deleteString, (err, rows) => {
				db.end();
				cb(err, rows);
			}) // service 에서 delete 할때 중간에 넣기 
		}
	}
}



// 1순위 (여기)

// db 연결 (화요일) 0

// models 정의 -> 오늘/내일까지 지(적어도 수요일 까지) 0 

// 회원가입 , 로그인 수요일 까지 

// service 정의 - 프론트와 상의를 좀 해봐야함.

// route 정의 - 프론트와 상의를 좀 해봐야함.2

// aws 적용.
