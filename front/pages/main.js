import React, {useEffect, useRef} from "react";
import {CircularProgress} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import {LOAD_DIARIES_REQUEST, LOAD_FAVORITE_REQUEST} from "../reducers/diary";
import {useDispatch, useSelector} from "react-redux";
import {
    CHANGE_CURRENTPAGE_REQUEST,
    LOAD_FOLLOWERLIST_REQUEST,
    LOAD_FOLLOWINGLIST_REQUEST,
    LOAD_TODO_REQUEST,
    LOAD_USER_REQUEST
} from "../reducers/user";
import FollowDrawer from "../components/FollowDrawer";
import {useRouter} from "next/router";
import MainCardDiary from "../components/MainCardDiary";
import TodoList from "../components/TodoList";
import Typography from "@material-ui/core/Typography";
import {mainStyle} from "../styles/mainStyles";




const Main = () => {

    const classes = mainStyle();
    const {cardDiaries, hasMoreDiary, isRequestingDiary} = useSelector(state => state.diary);
    const { loginUser, isLoggingOut, followingList, isLoggedIn, isOpenedDraw} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const countRef = useRef([]); //무한 스크롤링 시 lastId 를 저장 할 배열

    //로그아웃 또는 로그인 안한 사용자가 들어올 경우 메인으로 돌리기
    useEffect(() => {
        if(!loginUser || !isLoggedIn){
            router.push('/');
            return;
        }

    }, [loginUser, isLoggingOut]);

    useEffect(() => {
    }, [isRequestingDiary]);

    //무한스크롤링 스크롤 이벤트
    const onScroll = () => {
        if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300){
            if(hasMoreDiary && cardDiaries.length > 4){
                const lastId = cardDiaries.length !== 0 && cardDiaries[cardDiaries.length -1].id ;
                if(!countRef.current.includes(lastId)){ //호출 할 lastId가 이미 사용했던거면 막음
                    dispatch({
                        type: LOAD_DIARIES_REQUEST,
                        lastId: lastId,
                    });
                    countRef.current.push(lastId); //사용했던 lastId 배열에 저장
                }
            }
        }
    }
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll)
        }
    }, [cardDiaries.length]);

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.todoListWrapper}>
                    <TodoList/>
                </div>
                <div className={classes.mainCardDiaryWrapper}>
                    {cardDiaries.map(v => {
                    return (
                        <MainCardDiary key={v.id} diary={v} />
                    )})}
                    {isRequestingDiary &&
                        <div className={classes.progress}>
                            <CircularProgress color="secondary" />
                        </div>
                    }
                    <div style={{margin:'5% 5%'}}>
                        {!hasMoreDiary && countRef.current.length !== 0 &&
                        <Typography className={classes.typography}  color="textSecondary" align="center">더 표시할 게시물이 없습니다.</Typography>
                        }
                    </div>
                </div>
                {/*<div className={clsx(!isOpenedDraw ? classes.followerDrawWrapperHide : isPhone ? classes.followerDrawWrapperPhone : classes.followerDrawWrapperWeb)}>*/}
                <div className={classes.followerDrawWrapperPhone}>
                    <FollowDrawer />
                </div>
            </div>
        </>
    );
}

Main.getInitialProps = (context) => {
    let userId = 0;
    const queryId = context.query.id && parseInt(context.query.id, 10);

    if(queryId){
        userId = queryId;
    }

    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: userId,
    });

    context.store.dispatch({
        type: LOAD_FOLLOWINGLIST_REQUEST,
    });

    context.store.dispatch({
        type: LOAD_DIARIES_REQUEST,
    });

    context.store.dispatch({
        type: LOAD_FAVORITE_REQUEST,
        data: userId,
    });

    context.store.dispatch({
        type: LOAD_FOLLOWERLIST_REQUEST,
    });
    context.store.dispatch({
        type: CHANGE_CURRENTPAGE_REQUEST,
        data: 'Main Page',
    });
    context.store.dispatch({
        type: LOAD_TODO_REQUEST,
    });
}
export default Main;