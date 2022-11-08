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
        let status = 0;  
        let trash_name = req.body.trash_name;
        let author = verify_jwt(req.cookies.accessToken, 'access').email ;
        Trash_can.insert_new_location( address , latitude  , longitude , kind , status , trash_name , trash_name ,  author , (rows) => {  
            res.status(201).json({message : 'insert status success!!'});
            
        })
        

    },

    update_delete_point : (req ,res) => {req.id , req.
        Trash_can.update_trash_can_deletepoint()
    },

    review_trashcan : (req , res) => {

        
        Trash_can.update_trash_can_status(req.id , delete_point , (rows) =>{
            res.status(200).json({message : 'update status success!!'});
        })
    },

    delete_trashcan : (req , res) => {
        // join 함수로 해결하기 

        Trash_can.delete_trash_can(req.id , (rows) => {
            res.status(200).json({message : 'delete status success!!'});
        })
    }
    

}


