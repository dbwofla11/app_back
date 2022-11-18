// 쓰레기통 관련 기능
const Trash_can = require('../models/trash_can_location');
const Users = require('../models/users');
const { verify_jwt } = require('../utils/jwt_service') 

module.exports ={

    get_trash_main_dis : async (req ,res) => {
        const x1 = req.body.x1;
        const x2 = req.body.x2;
        const y1 = req.body.y1;
        const y2 = req.body.y2;
        const trash = await Trash_can.get_trash_by_xy(x1 , x2 , y1 , y2);
        
        return res.json({
            data: trash
        })
    },

    get_trash_all : async ( req , res ) => {
        const trash = await Trash_can.get_location_all();
        return res.json({
            data: trash
        })
    },

    get_trash_id : async (req , res) => {
        const trash_id = req.body.id;
        const trash = await Trash_can.get_by_id(trash_id);

        return res.json({
            address : trash.address,
            full_status : trash.full_status,
            detail : trash.detail
        })
    },

    add_trashcan : async (req , res) => {
        const address = req.body.address;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude; 
        const kind = req.body.kind; // 담배는 0 재활용은 1 일반 쓰레기통은 2
        const full_status = req.body.full_status; // 상태 0 , 1 , 2   
        const trash_name = req.body.trash_name;
        const user_email = verify_jwt(req.cookies.accessToken, 'access').email;
        const user = await Users.get_user_by_email(user_email); // author을 추가하기 위함 
        const detail = req.body.detail;        
        
        if ( user.add_point > 2 ){
            return res.json({result : true, message : "이미 하루 최대 추가 횟수를 체우셨습니다"});
            
        } else{
            await Trash_can.insert_new_location( address , latitude  , longitude , kind , full_status , trash_name , user.id , detail ); // 
            
            await Users.update_user_point(user.id , user.point + 50);

            await Users.update_user_add_cnt(user_email , user.add_point + 1);

            return res.json({result : true, message : "쓰레기통 추가가 완료되었습니다."});
        }
    },

    review_trashcan : async (req , res) => {
        const full_status = req.body.full_status;
        const detail = req.body.detail;
        const trash_id = req.body.id;
        const user_email = verify_jwt(req.cookies.accessToken, 'access').email ;
        let user = await Users.get_user_by_email(user_email);

        if ( user.review_point > 9 ){
            return res.json({result : true, message : "이미 하루 최대 리뷰 횟수를 체우셨습니다."});

        } else {
            await Trash_can.update_trash_can_status(trash_id , full_status , detail);

            await Users.update_user_point(user.id , user.point + 10);

            await Users.update_user_review_cnt(user_email , user.review_point + 1);

            return res.json({result : true, message : "리뷰가 업데이트 되었습니다"});
        }
    },

    delete_trashcan : async (req , res) => {
        const trash_id = req.body.id; // 쓰레기통 아이디 
        const user_email = verify_jwt(req.cookies.accessToken, 'access').email ;

        let trash_delete_point = await Trash_can.get_trash_can_delete_point(trash_id);
        
        let [user , author] = await Promise.all([Users.get_user_by_email(user_email) , Trash_can.get_author_point(trash_id)])

        if( user.del_point >= 3 ){

            return res.json({result : true , message : "이미 하루 최대 삭제요청 횟수를 체우셨습니다."})
        }
        else {
            trash_delete_point += 1;

            await Users.update_user_point(user.id , user.point + 10); // 신고를 요청한 사람 

            if (trash_delete_point >= 3){
                await Trash_can.delete_trash_can(trash_id);

                await Users.update_user_point(author.id , author.point - 50);

                await Users.update_user_delete_cnt(user_email , user.del_point + 1);

                return res.json({result : true , message : "쓰레기통이 정상적으로 삭제되었습니다."});
            }
            else{
                await Trash_can.update_trash_can_deletepoint(trash_id , trash_delete_point);

                await Users.update_user_delete_cnt(user_email , user.del_point + 1);

                return res.json({result : true , message : "삭제요청이 완료되었습니다."});
            }

        }
    }
}


