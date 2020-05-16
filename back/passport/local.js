const passport = require('passport');
const { Strategy: LocalStrategy} = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email', //프론트에서 req.body에 넣어준 값
        passwordField: 'password',
    }, async (email, password, done) => {
        try{
            const user = await db.User.findOne({ where: {email}});
            if(!user){
                //done(서버쪽 에러 났을때, 성공했을때, 로직상에서 에러가났을때)
                return done(null, false, { reason: '존재하지 않는 사용자입니다!'});
            }
            const result = await bcrypt.compare(password, user.password); //아이디가 존재하면 비밀번호 일치여부 확인
            if(result) {
                return done(null, user);
            }
            return done(null, false, { reason: '비밀번호가 틀립니다.'});
        }catch (e) {
            console.error(e);
            return done(e);
        }
    }));
}