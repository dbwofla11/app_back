// 쓰레기통 관련 기능
const Trash_can = require('../models/trash_can_location');
const Users = require('../models/users');
const { verify_jwt } = require('../utils/jwt_service') 

module.exports ={

    get_trash_main_dis : async (req ,res) => {
        let x1 = req.body.x1;
        let x2 = req.body.x2;
        let y1 = req.body.y1;
        let y2 = req.body.y2;
        const trash = await Trash_can.get_trash_by_xy(x1 , x2 , y1 , y2);
        
        return res.json({
            id : trash.id,
            address : trash.address,
            kind : trash.kind ,
            status : trash.status,
            latitude : trash.latitude , 
            longitude : trash.longitude,
            delete_point : trash.delete_point,
            trash_name : trash.trash_name,
            author : trash.author , // 작성자 id 값 이메일 아님 
            detail : trash.detail 
        })
    },

    get_trash_id : async (req , res) => {
        const trash_id = req.body.id;
        const trash = await Trash_can.get_by_id(trash_id);

        return res.json({
            address : trash.address,
            status : trash.status,
            detail : trash.detail
        })
    },

    add_trashcan : async (req , res) => {
        let address = req.body.address;
        let latitude = req.body.latitude;
        let longitude = req.body.longitude; 
        let kind = req.body.kind; // 담배는 1 재활용은 2 일반 쓰레기통은 3
        let full_status = 0;  
        let trash_name = req.body.trash_name;
        let user_id = verify_jwt(req.cookies.accessToken, 'access').email;
        let user = await Users.get_user_by_email(user_id); // author을 추가하기 위함 
        let detail = req.body.detail;        
        
        if ( user.add_point > 3 ){
            return res.json({result : true, message : "3번 이상의 add를 이미 했습니다"});
        } else{
            await Trash_can.insert_new_location( address , latitude  , longitude , kind , full_status , trash_name , trash_name ,  user.id , detail ); // 
            await Users.update_user_point(user_id , user.point + 50);
            await Users.update_user_add_cnt(user_id , user.add_point + 1);
            return res.json({result : true, message : "위치 추가에 성공하였습니다."});
        }
    },

    review_trashcan : async (req , res) => {
        let full_status = req.body.full_status;
        let detail = req.body.detail;
        let trash_id = req.body.id;
        let user_id = verify_jwt(req.cookies.accessToken, 'access').email ;
        let user = await Users.get_user_by_email(user_id);

        if ( user.review_point > 10 ){
            return res.json({result : true, message : "10번 이상의 리뷰를 이미 했습니다"});
        } else {
            await Trash_can.update_trash_can_status(trash_id , full_status , detail);
            await Users.update_user_point(user_id , user.point + 10);
            await Users.update_user_review_cnt(user_id , user.review_point + 1);
            return res.json({result : true, message : "리뷰가 업데이트 되었습니다"});
        }
    },

    delete_trashcan : async (req , res) => {
        let trash_id = req.body.id; // 쓰레기통 아이디 
        let user_id = verify_jwt(req.cookies.accessToken, 'access').email ;
        let trash_delete_point = await Trash_can.get_trash_can_delete_point(trash_id);
        // let user = await Users.get_user_by_email(user_id);
        // let author = await Trash_can.get_author_point(trash_id)
        const [user , author] = await Promise.all([Users.get_user_by_email(user_id) , Trash_can.get_author_point(trash_id)])

        if( user.del_point >= 3 ){
            return res.json({result : true , message : "너무 삭제요청을 많이 하셔서 오늘은 좀 쉬어야 되겠네요~~~~~"})
        }
        else {
            trash_delete_point += 1;
            await Users.update_user_point(user_id , user.point + 10); // 신고를 요청한 사람 

            if (trash_delete_point >= 3){
                await Trash_can.delete_trash_can(trash_id);
                await Users.update_user_point(author.id , author.point - 50);
                await Users.update_user_delete_cnt(user_id , user.del_point + 1);
                return res.json({result : true , message : "쓰레기통이 정상적으로 삭제되었습니다."});
            }
            else{
                await Trash_can.update_trash_can_deletepoint(trash_id , trash_delete_point);
                await Users.update_user_delete_cnt(user_id , user.del_point + 1);
                return res.json({result : true , message : "삭제요청이 완료되었습니다. !! ( 업데이트 delete_point <= 3 ) "});
            }

        }
    }
}


