// 쓰레기통 관련 기능
const Trash_can = require('../models/trash_can_location').trash_can;
const Users = require('../models/users').user;
const { verify_jwt } = require('../utils/jwt_service') 
const { execute } = require('../utils/dbQuery'); 

module.exports ={
    add_trashcan : (req , res) => {
        // let add_cnt = (함수입력 갯수 \)
        // 필요조건 : 12시 초기화 쿨타임 X , 등록한 사람에게 포인트 전달 , 등록자 이름 등록 O,
        let address = req.body.address;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude; 
        let kind = req.body.kind; // 담배는 1 재활용은 2 일반 쓰레기통은 3
        let full_status = 0;  
        let trash_name = req.body.trash_name;
        let author = verify_jwt(req.cookies.accessToken, 'access').email ;
        let detail = req.body.detail;
        
        Trash_can.insert_new_location( address , latitude  , longitude , kind , full_status , trash_name , trash_name ,  author , detail );

        return res.json({result : true, message : "위치 추가에 성공하였습니다."});
    },

    update_delete_point : (req , res) => { // 마커에서 정보를 불러올시 body가 아닌 그냥 마커에서 가져올 수 있다. 
        let id = req.body.id;
        let delete_point = req.body.delete_point;
        Trash_can.update_trash_can_deletepoint(id , delete_point);
    },

    review_trashcan : (req , res) => {
        let full_status = req.body.full_status;
        let detail = req.body.detail;
        let id = req.body.id;
        Trash_can.update_trash_can_status(id , full_status , detail);
    },

    delete_trashcan : async (req , res) => {
        let id = req.body.id;
        let delete_point = await Trash_can.get_trash_can_delete_point(id);
        if (delete_point <= 3){
            delete_point += 1;
            Trash_can.update_trash_can_deletepoint(delete_point , id)

            Trash_can.delete_trash_can(id);
            return res.json({result : true, message : "위치 삭제에 성공했습니다."});
        } else {
            return res.json({result : true , message : "delete 포인트가 3이 넘습니다 !!"});
        }        
    }
    

}


