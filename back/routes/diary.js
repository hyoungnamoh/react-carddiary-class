const express = require('express');
const router = express.Router();
const db = require('../models');
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
});
//업로드 설정
const upload = multer({
    storage: multerS3({ //저장 옵션 서버쪽 디스크에 저장
        s3: new AWS.S3(),
        bucket: 'react-carddiary',
        key(req, file, cb) {
            cb(null, `original/${+new Date()}${path.basename(file.originalname)}`);
        },
    }),
    limits: { fileSize: 20 * 1024 * 1024 }, //파일크기 제한 옵션
});

//다이어리 작성하기
router.post('/',  upload.none(), async (req, res, next) => {
    try{
        const hashtags = req.body.diaryContent.match(/#[^\s]+/g);
        let isFavorite = 0;
        let isPublic = 0;
        if(req.body.isFavorite){
            isFavorite = 1;
        }
        if(req.body.isPublic.trim() === "publicDiary"){
            isPublic = 1;
        }
        const newDiary = await db.Diary.create({
            diaryContent: req.body.diaryContent,
            diaryTitle: req.body.diaryTitle,
            isPublic: isPublic,
            isFavorite: isFavorite,
            UserId: req.user.id, //글쓴이(나)
        });
        if(hashtags){
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({ //찾아서 있으면 찾고 없으면 생성
                where: { name: tag.slice(1).toLowerCase() },//# 자르고 소문자로 통일
            })));
            await newDiary.addHashtags(result.map(r => r[0])); //시퀄라이즈가 만들어주는 함수 Diary와 Hashtag 의 관계를 추가해주는 역할, add 외에도 get,set,remove 등 있음
        }
        if(req.body.image){
            if(Array.isArray(req.body.image)){
                const images = await Promise.all(req.body.image.map((image) => {
                    return db.Image.create({ src: image });
                }));
                await newDiary.addImage(images);
            }else{ //한장일 경우
                const image = await db.Image.create({ src: req.body.image });
                await newDiary.addImage(image);
            }
        }
        const fullUser = await db.Diary.findOne({
            where: { id: newDiary.id },
            include: [{
                model: db.User,
            }, {
                model: db.Image,
            }],
        });
        res.json(fullUser);
    }catch (e) {
        console.error(e);
        next(e);
    }
});

//이미지 업로드하기
router.post('/images', upload.array('image'), (req, res) => {
    res.json(req.files.map(v => v.location));
});

//즐겨찾기 버튼 클릭
router.patch('/favorite', async (req, res, next) => {
    try{
        const diary = await db.Diary.findOne({ where: { id: req.body.id, UserId: req.user.id }});
        if(diary.isFavorite){
            await db.Diary.update({
                isFavorite: 0,
            },{
                where: { id: req.body.id, UserId: req.user.id },
            });
        } else {
            await db.Diary.update({
                isFavorite: 1,
            },{
                where: { id: req.body.id, UserId: req.user.id },
            });
        }
        const favoriteDiaries = await db.Diary.findAll({ where: { UserId: req.user.id, isFavorite: 1 }});
        res.json(favoriteDiaries);
    } catch(e){
        console.error(e);
        next(e);
    }
});

//개별 다이어리 가져오기
router.get('/:id', async (req, res, next) => {
    try{
        const diary = await db.Diary.findOne(
            {
                where: {id: req.params.id},
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
            });
        res.json(diary);
    } catch(e){
        console.error(e);
        next(e);
    }
});

//다이어리 삭제하기
router.delete('/:id', async (req, res, next) => {
    try{
        await db.Diary.destroy({ where: {id: req.params.id }});
        res.send(req.params.id);
    } catch(e){
        console.error(e);
        next(e);
    }
});

//다이어리 수정하기
router.patch('/editDiary', upload.none(), async (req, res, next) => {
    try{
        const hashtags = req.body.diaryContent.match(/#[^\s]+/g);
        const isFavorite = req.body.isFavorite ? 0 : 1;
        const isPublic = req.body.isPublic.trim() === "publicDiary"  ? 1 : 0;
        const diary = await db.Diary.findOne({ where: { id: req.body.id}});

        if(hashtags){
            const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({ //찾아서 있으면 찾고 없으면 생성
                where: { name: tag.slice(1).toLowerCase() },//# 자르고 소문자로 통일
            })));
            await diary.addHashtags(result.map(r => r[0])); //시퀄라이즈가 만들어주는 함수 Diary와 Hashtag 의 관계를 추가해주는 역할, add 외에도 get,set,remove 등 있음
        }

        //원래 있던 이미지를 모두 지움
        await db.Image.destroy({ where: {DiaryId: req.body.id }});

        let image;
        if(Array.isArray(req.body.image)){
            image = await Promise.all(req.body.image.map((image) => {
                return db.Image.create({ src: image });
            }));
        }else{ //한장일 경우
            image = await db.Image.create({ src: req.body.image });
        }
        //다이어리 업데이트
        await db.Diary.update({
            isPublic: isPublic,
            diaryTitle: req.body.diaryTitle,
            diaryContent: req.body.diaryContent,
            isFavorite: isFavorite,
        },{
            where: { id: req.body.id},
        });
        //새로운 이미지 추가
        await diary.addImage(image);
        res.json(diary);
    } catch(e){
        console.error(e);
        next(e);
    }
});

//좋아요 누르기
router.post('/like/:id', async (req, res, next) => {
    try{
        const diary = await db.Diary.findOne({ where: { id: req.params.id }});
        await diary.addLikers(req.user.id);
        res.json({ userId: req.user.id, diaryId: diary.id});
    } catch(e){
        console.error(e);
        next(e);
    }
});

//좋아요 취소하기
router.delete('/like/:id', async (req, res, next) => {
    try{
        const diary = await db.Diary.findOne({ where: { id: req.params.id }});
        await diary.removeLikers(req.user.id);
        res.json({ userId: req.user.id, diaryId: diary.id});
    } catch(e){
        console.error(e);
        next(e);
    }
});



module.exports = router;