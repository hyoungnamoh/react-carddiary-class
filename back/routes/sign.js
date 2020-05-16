const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

// 이메일 중복검사
router.post('/emailCheck', async (req, res, next) => {
    try {
        const exEmail = await db.User.findOne({
            where: { //조회
                email: req.body.email,
            },
        });
        return exEmail ? res.send(true) : res.send(false);
    }catch (e) {
        console.error(e);
        return next(e);
    }
});

// 회원가입하기
router.post('/signUp', async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);//salt 가 커질수록 해킹 위험은 낮아지지만 암호화하는데 시간이 오래걸림 10~13 사이로 ㄱㄱ

        //DB에 생성 저장
        const newUser = await db.User.create({
            userName: req.body.userName, //body 쓰려면 index.js 에 json, urlencoded 추가해야함
            email: req.body.email,
            password: hashedPassword,
        });

        //Log
        await db.Log.create({
            logType: 'signIn',
        });

        return res.status(200).json(newUser);
    }catch (e) {
        console.error(e);
        //에러처리 후에 next로 넘겨야함
        return next(e); //알아서 프론트에 에러가 났다고 알려줌
    }
});

// 로그인 기능
router.post('/signIn', (req, res, next) => {//(Strategy 명
    passport.authenticate('local', (err, user, info) => { //info = done 에 세번째 인자(로직상 에러)
        //서버 에러가 있을 경우
        if(err){
            console.error(err);
            next(err);
        }
        //로직상 에러가 있을 경우
        if(info){
            return res.status(401).send(info.reason);
        }
        //에러가 없을 경우
        return req.login(user, async (loginErr) => {
            try {//login 중 에러
                if (loginErr) {
                    return next(loginErr);
                }
                const fullUser = await db.User.findOne({
                    where: { id: user.id},
                    include: [{
                        model: db.Diary,
                        as: 'Diaries',
                        attributes: ['id'],
                    },{
                        model: db.ProfileImage,
                        as: 'ProfileImage',
                        attributes: ['src'],
                    },],
                    attributes: ['userName', 'id', 'email'],
                });
                await db.Log.create({
                    logType: 'logIn',
                });
                return res.json(fullUser);
            } catch (e) {
                next(e);
            }
        });
    })(req, res, next);
});

// 로그아웃 기능
router.post('/logout', async (req, res) => {
    await db.Log.create({
        logType: 'logOut',
    });
    req.logout();
    req.session.destroy();
    res.send('logout 성공');
});

// 메인페이지 로그 기능
router.post('/log', async (req, res) => {
    await db.Log.create({
        logType: 'main',
    });
    res.send('log');
});

module.exports = router;