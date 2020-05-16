import React, {useEffect, useRef} from "react";
import {Grid, GridList, GridListTile, GridListTileBar} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles';
import {LOAD_HASHTAG_REQUEST} from "../reducers/diary";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import FollowDrawer from "../components/FollowDrawer";
import Link from "next/link";
import {
    CHANGE_CURRENTPAGE_REQUEST,
    LOAD_FOLLOWERLIST_REQUEST,
    LOAD_FOLLOWINGLIST_REQUEST,
    LOAD_TODO_REQUEST,
    LOAD_USER_REQUEST
} from "../reducers/user";
import TodoList from "../components/TodoList";
import Typography from "@material-ui/core/Typography";
import {hastagStyle} from "../styles/hashtagStyles";



const Hashtag = ({tag}) => {
    const classes = hastagStyle();
    const {hashtagDiaries} = useSelector(state => state.diary);
    const { loginUser, isLoggingOut, isLoggedIn} = useSelector(state => state.user);
    const dispatch = useDispatch();
    const router = useRouter();
    const countRef = useRef([]); //무한 스크롤링 시 lastId 를 저장 할 배열

    //로그아웃 또는 로그인하지 않은 사용자 처리
    useEffect(() => {
        if(!loginUser || !isLoggedIn){
            router.push('/');
            return;
        }
        return;
    }, [loginUser, isLoggingOut]);

    return (
        <>
            <div className={classes.mainContainer}>
                <div className={classes.todoListWrapper}>
                    <TodoList/>
                </div>
                <div className={classes.mainCardDiaryWrapper}>
                    <Grid item xs={12} className={classes.diariesContainer}>
                        <Typography variant="h5" gutterBottom style={{marginBottom:'5%'}}>
                            '{tag}' 해시태그 검색결과 입니다.
                        </Typography>
                            <GridList className={classes.gridList} cols={3}>
                                <GridListTile key="Subheader" >
                                    <img src={hashtagDiaries[0] && `${hashtagDiaries[Math.floor(Math.random() * hashtagDiaries.length)].Images[0].src}`} alt={tag} style={{}}/>
                                </GridListTile>
                                {hashtagDiaries.length !== 0 && hashtagDiaries.map((tile) => (
                                    <GridListTile key={tile.id} >
                                        <img src={`${tile.Images[0].src}`} alt={tile.diaryTitle} />
                                        <GridListTileBar
                                            title={tile.diaryTitle}
                                            subtitle={<span>by: {tile.User.userName}</span>}
                                            actionIcon={
                                                <Link href={{ pathname: '/cardDiaryDetails', query: { id: tile.id}}} as={`/diary/${tile.id}`}>
                                                    <IconButton aria-label={`info about ${tile.diaryTitle}`} className={classes.icon}>
                                                        <InfoIcon />
                                                    </IconButton>
                                                </Link>
                                            }
                                        />
                                    </GridListTile>
                                ))}
                            </GridList>
                    </Grid>
                </div>
                {/*<div className={clsx(!isOpenedDraw ? classes.followerDrawWrapperHide : isPhone ? classes.followerDrawWrapperPhone : classes.followerDrawWrapperWeb)}>*/}
                <div className={classes.followerDrawWrapperPhone}>
                    <FollowDrawer />
                </div>
            </div>
        </>
    );
}

Hashtag.getInitialProps = (context) => {
    let userId = 0;
    const queryId = context.query.id && parseInt(context.query.id, 10);

    if(queryId){
        userId = queryId;
    }
    context.store.dispatch({
       type: LOAD_HASHTAG_REQUEST,
       tag: context.query.tag,
    });

    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: userId,
    });

    context.store.dispatch({
        type: LOAD_FOLLOWINGLIST_REQUEST,
    });

    context.store.dispatch({
        type: LOAD_FOLLOWERLIST_REQUEST,
    });
    context.store.dispatch({
        type: CHANGE_CURRENTPAGE_REQUEST,
        data: 'Hashtag Page',
    });
    context.store.dispatch({
        type: LOAD_TODO_REQUEST,
    });
    return { tag: context.query.tag, }
}
export default Hashtag;