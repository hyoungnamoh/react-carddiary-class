import React, {useEffect, useRef} from 'react';
import {Button, Grid, makeStyles, Paper} from "@material-ui/core";
import {LOAD_FAVORITE_REQUEST, LOAD_USER_DIARIES_REQUEST} from "../reducers/diary";
import {useDispatch, useSelector} from "react-redux";
import Typography from '@material-ui/core/Typography';
import {CHANGE_CURRENTPAGE_REQUEST, LOAD_FOLLOWINGLIST_REQUEST, LOAD_USER_REQUEST,} from "../reducers/user";
import MyInfoEdit from "../components/MyInfoEdit";
import MyInfo from "../components/MyInfo";
import {yellow} from "@material-ui/core/colors";
import {useRouter} from "next/router";
import UserPageSearchbar from "../components/UserPageSearchbar";

const minWidth = 500;
const useStyles = makeStyles((theme) => ({
    info:{
        margin:'10%',

    },
    avatar:{
        width: "85%",
        height: 250,
        marginLeft:"5%",
    },
    diariesContainer: {

    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        paddingBottom:0,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    starIcon:{
        color: yellow[700],
    },
    userPaper:{
        width:'85%',
        marginTop:'5%',
        marginBottom:'5%',
    },
    paperWrapper:{
        display:'flex',
        justifyContent:"center",
        width: '100vw',
    },
    [`@media (max-width: ${minWidth}px)`]: {
        paperWrapper:{
            marginTop:'10%',
        },
        diariesContainer:{
        },
        userPaper:{
            width:'100%',
        },
    },
}));

const User = () => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const {loginUser, isEditing, personalUser, followingList, isLoggingOut, isLoggedIn} = useSelector(state => state.user);
    const {loginUserCardDiaries, isFavoriteCard, hasMoreDiary} = useSelector(state => state.diary);

    const countRef = useRef([]);
    const router = useRouter();

    //로그아웃 또는 로그인하지 않은 사용자 처리
    useEffect(() => {
        if(!loginUser || !isLoggedIn){
            router.push('/');
            return;
        }
        return;
    }, [loginUser, isLoggingOut]);

    //더보기 버튼
    const onClickViewMore = () => {
        if(hasMoreDiary){
            const lastId = loginUserCardDiaries.length !== 0 && loginUserCardDiaries[loginUserCardDiaries.length -1].id ;
            if(!countRef.current.includes(lastId)){ //호출 할 lastId가 이미 사용했던거면 막음
                dispatch({
                    type: LOAD_USER_DIARIES_REQUEST,
                    data: loginUser.id,
                    lastId:lastId,
                });
                countRef.current.push(lastId); //사용했던 lastId 배열에 저장
            }
        }
    }
    return (
        <div className={classes.paperWrapper}>
            <Paper className={classes.userPaper}>
                <Grid container>
                    <Grid item md={3}>
                        <div className={classes.info}>
                            {isEditing
                                ?
                                // 내 정보 수정
                                <MyInfoEdit loginUser={loginUser}/>
                                :
                                <MyInfo loginUser={loginUser}/>
                                // 내 정보
                            }
                        </div>
                    </Grid>
                    <Grid item md={9}>
                        <div className={classes.diariesContainer}>
                            <UserPageSearchbar/>
                            <div style={{display:'flex', justifyContent:'center', margin:'5%'}}>
                                {hasMoreDiary
                                    ? <Button color="primary" size="large"  onClick={onClickViewMore}>더보기</Button>
                                    : loginUserCardDiaries.length > 8 && <Typography variant="body2" color="textSecondary"  >더 표시할 게시물이 없습니다.</Typography>
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
};

User.getInitialProps = (context) => {
    let userId = 0;
    const queryId = context.query.userId && parseInt(context.query.userId, 10);
    if(queryId){
        userId = queryId;
    }
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: userId,
    });

    context.store.dispatch({
        type: LOAD_USER_DIARIES_REQUEST,
        data: userId,
    });
    context.store.dispatch({
        type: LOAD_FAVORITE_REQUEST,
        data: userId,
    });
    context.store.dispatch({
        type: LOAD_FOLLOWINGLIST_REQUEST,
    });
    context.store.dispatch({
        type: CHANGE_CURRENTPAGE_REQUEST,
        data: 'User Page',
    });

}
export default User;