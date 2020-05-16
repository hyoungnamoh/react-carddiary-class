const express = require('express');
const router = express.Router();
const db = require('../models');

//내 팔로잉 사람들 게시물 전부 가져오기
router.get('/', async (req, res, next) => {
    try{
        const user = await db.User.findOne({
            where: { id: req.user.id }
        });
        const followings = await user.getFollowings({
            attributes: ['id'],
        },);
        const followingsIdArray = followings.map(f => f.id);
        followingsIdArray.push(user.id);
        let where = {
            UserId: {
                [db.Sequelize.Op.in]: followingsIdArray,
            },
            isPublic: 1,
        };
        if(parseInt(req.query.lastId, 10)){
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
                },
                UserId: {
                    [db.Sequelize.Op.in]: followingsIdArray,
                },
                isPublic: 1,
            };
        }
        const diaries = await db.Diary.findAll({
            where,
            include: [{
                model: db.User,
                attributes: ['id', 'userName', 'email'],
                as:'User',
                include:[{
                    model: db.ProfileImage,
                    as:'ProfileImage'
                }]
            },{
                model: db.Image,
            },{
                model: db.User, //게시글 좋아요 누른사람 include
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10),
        });
        res.json(diaries);
    }catch (e) {
        console.error(e);
        next(e);
    }
});

//유저 다이어리들 가져오기
router.get('/user/:id', async (req, res, next) => {
    try{
        let where = {
            UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
            isPublic: 1,
        };
        if(parseInt(req.query.lastId, 10)) {
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
                },
                UserId: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
                isPublic: 1,
            }
        }
        const diaries = await db.Diary.findAll({
            where,
            include: [{
                model: db.User,
                attributes: ['id', 'userName', 'email'],
                as:'User',
                include:[{
                    model: db.ProfileImage,
                    as:'ProfileImage'
                }]
            },{
                model: db.Image,
            },{
                model: db.User,
                through: 'Like',
                as: 'Likers',
                attributes: ['id'],
            }],
            limit: parseInt(req.query.limit, 10),
            order: [['createdAt', 'DESC']],
        });
        res.json(diaries);
    }catch (e) {
        console.error(e);
        next(e);
    }
});


//즐겨찾기 목록 가져오기
router.get('/favorite', async (req, res, next) => {
    try{
        const favoriteDiaries = await db.Diary.findAll(
            {
                where: {
                    isFavorite: 1,
                    UserId: req.user.id,
                },
            });
        res.json(favoriteDiaries);
    } catch(e){
        console.error(e);
        next(e);
    }
});

//해시태그 게시물 가져오기
router.get('/hashtag/:tag', async (req, res, next) => {
    try{
        let where = {};
        if(parseInt(req.query.lastId, 10)){
            where = {
                id: {
                    [db.Sequelize.Op.lt]: parseInt(req.query.lastId, 10),
                }
            }
        }
        const hashtagDiaries = await db.Diary.findAll({
            where,
            include: [{
                model: db.Hashtag,
                where: { name: decodeURIComponent(req.params.tag)},
            }, {
                model: db.User,
                attributes: ['id', 'userName', "email"],
            }, {
                model: db.Image,
            },],
            order: [['createdAt', 'DESC']],
            limit: parseInt(req.query.limit, 10),
        });
        res.json(hashtagDiaries);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;