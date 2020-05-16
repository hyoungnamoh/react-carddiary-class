exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        //괄호안에 e를 넣으면 에러처리하는 곳으로 넘어가지만 아무것도 안넣으면 다음 미들웨어로 넘어감
        next();
    } else{
        res.status(401).send('로그인이 필요합니다.');
    };
}