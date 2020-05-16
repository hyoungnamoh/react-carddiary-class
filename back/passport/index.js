/*
    로컬 또는 API 연동 로그인 총괄하는 파일
 */
const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
    //서버쪽에 [{id: 3, cookie: 'qasdsa'}] 이런 형태로 저장해 둠 여기서 cookie를 프론트로 보내줌, 프론트에서 해당 cookie를 서버로 보내면 cookie와 연결된 id값의 데이터를 찾아 넘겨 줌
    //이렇게 하면 아이디만 저장하기 때문에 서버쪽 메모리 사용을 최소화 함
    passport.serializeUser((user, done) => {
        return done(null, user.id);
    });

    //사용자가 로그인을 하면 로그인 정보를 세션에 저장하는데 정보를 전부 서버쪽 메모리에 저장하게 되면 문제가 됨
    passport.deserializeUser(async (id, done) => { //찾은 id로 유저 정보를 불러옴
        try{
            const user = await db.User.findOne({
                where: {id},
            });
            return done(null, user); // req.user 에 저장
        } catch (e) {
            console.error(e);
            return done(e);
        }
    });
    //로그인 전략 연결
    local();
};