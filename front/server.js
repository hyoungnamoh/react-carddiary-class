const express = require('express');
const morgan = require('morgan');
const next = require('next');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');
const dev = process.env.NODE_ENV !== 'develoment'; //개발모드
const prod = process.env.NODE_ENV === 'production'; //배포모드
const path = require('path');

//express와 next 연결
const app = next({ dev }); //true
const handle = app.getRequestHandler();

dotenv.config();

app.prepare().then(() => {
   const server = express(); //next

   server.use(morgan('dev'));
    server.use('/', express.static(path.join(__dirname, 'public')));
   server.use(express.json());
   server.use(express.urlencoded({extended:true}));
   server.use(cookieParser(process.env.COOKIE_SECRET)) //백엔드와 똑같이 설정 해줘야 함, 서버가 두갠데 쿠키 시크릿이 달라지면 서로의 쿠키를 해독 못함
   server.use(expressSession({
       resave: false,
       saveUninitialized: false,
       secret: process.env.COOKIE_SECRET,
       cookie: {
           hasOwnProperty: true,
           secure: false,
       },
    }));
    //다이어리 상세보기
    server.get('/diary/:id', (req, res) => {
        return app.render(req, res, '/cardDiaryDetails', {id: req.params.id});
    });
    //유저 별 마이페이지
    server.get('/user/:id', (req, res) => {
        return app.render(req, res, '/user', {userId: req.params.id});
    });
    //해시태그 페이지
    server.get('/diary/hashtag/:tag', async (req, res) => {
        const tag = await req.params.tag.replace(/(^\s*)|(\s*$)/gi, "");
        return app.render(req, res, '/hashtag', {tag: tag});
    });
    //* 모든 get 요청 처리
   server.get('*', (req, res) => {
       return handle(req, res);
   });


   server.listen(prod ? process.env.PORT : 3642, () => {
       console.log(`next+express running on port ${prod ? process.env.PORT : 3642}`);
   })
});