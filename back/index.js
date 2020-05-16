const express = require('express');
const morgan = require('morgan'); //로깅
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSessin = require('express-session');
const dotenv = require('dotenv');
const passport = require('passport');
const dev = process.env.NODE_ENV !== 'develoment'; //개발모드
const prod = process.env.NODE_ENV === 'production'; //배포모드
const hpp = require('hpp');
const db = require('./models');
const userAPIRouter = require('./routes/user');
const diaryAPIRouter = require('./routes/diary');
const diariesAPIRouter = require('./routes/diaries');
const signAPIRouter = require('./routes/sign');
const passportConfig = require('./passport');

db.sequelize.sync(); //자동으로 테이블 만들어줌
dotenv.config(); //.env 실행 password 읽어옴
passportConfig(); //passport 실행

const app = express(prod);

if(prod){
    app.use(hpp());
    app.use(morgan('combined'));
    app.use(cors({
        origin: 'http://carddiary.site',
        credentials: true,
    }));
} else{
    //로깅 관련 middleware
    app.use(morgan('dev')); //로깅 남겨 줌

    //cors 에러 middleware
    app.use(cors({//cors 오류 잡아줌 도메인이 다른데 요청을 할 경우 서버에서 거절함. 이걸 해결 해 줌
        origin: true, //요청 주소와 같게
        credentials: true,
    }));
}

//서버 확인
app.get('/', (req, res) => {
    res.send('react carddiary 백엔드 정상 동작!');
});

//request.body 관련 middleware
app.use(express.json()); //json으로 변환해줌
app.use(express.urlencoded({ extended: true})); //body로 넣어줌

//login 관련 middleware
app.use(cookieParser(process.env.COOKIE_SECRET)); //cookie를 알아서 parsing
app.use(expressSessin({ //session 사용하게 해 줌
    //resave, saveInitialized 무조건 넣어줘야함 보통 false로 함
    resave:false, //매번 세션 강제저장
    saveUninitialized: false, //빈 값도 저장
    secret: process.env.COOKIE_SECRET, //암호화 키
    cookie: {
        httpOnly: true, //쿠키를 자바스크립트에서 접근 못하게 함
        secure: false, //https 사용 시 true로 해야함
        domain: prod && '.carddiary.site', //front 와 server 쿠키 통일, 여기서 .이 프론트 주소와 서버 주소 모두 사용할 수 있게 함
    },
    name: 'hyoungnam'
}));

//이미지 업로드
app.use('/', express.static('uploads')); //이미지 미리보기, express 안에 static 미들웨어 사용, 경로(두번째 인자)를 지정하면 다른서버에서 자유롭게 가져갈 수 있게 해줌, 첫번째 인자는 uploads 폴더를 루트처럼 사용할 수 있게 하겠다. . .

app.use(passport.initialize()); //서버 쪽 세션 두기, 프론트쪽에 쿠키 보내기, 매번 누가 로그인 했는지 확인하는작업을 얘가 다 해 줌
app.use(passport.session()); //얘는 express session 아래에 넣어줘야함, 의존관계



app.use('/api/user', userAPIRouter);
app.use('/api/diary', diaryAPIRouter);
app.use('/api/diaries', diariesAPIRouter);
app.use('/api/sign', signAPIRouter);

app.listen(prod ? process.env.PORT : 3603, () => {
    console.log(`server is running on ${process.env.PORT}`);
});