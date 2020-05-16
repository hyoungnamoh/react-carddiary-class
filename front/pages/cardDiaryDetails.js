import React, {useCallback, useEffect, useRef, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import {Carousel} from 'react-responsive-carousel';
import {
    DELETE_DIARY_REQUEST,
    LIKE_DIARY_REQUEST,
    LOAD_DIARY_REQUEST,
    LOAD_FAVORITE_REQUEST,
    ONCLICK_FAVORITE_REQUEST,
    UNLIKE_DIARY_REQUEST
} from "../reducers/diary";
import {useDispatch, useSelector} from "react-redux";
import Router, {useRouter} from "next/router";
import {CHANGE_CURRENTPAGE_REQUEST} from "../reducers/user";
import Link from "next/link";
import FavoriteIcon from "@material-ui/icons/Favorite";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import {ClickAwayListener, Grow, MenuList, Paper, Popper} from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import DeleteIcon from "@material-ui/icons/Delete";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import moment from "moment"
import {cardDiaryDetailsStyle} from "../styles/cardDiaryDetailsStyle";


const cardDiaryDetails = () => {
    const classes = cardDiaryDetailsStyle();
    const dispatch = useDispatch();
    const router = useRouter();
    const {loginUser, isLoggingOut, isLoggedIn} = useSelector(state => state.user);
    const {cardDiary, favoriteDiaries} = useSelector(state => state.diary);
    const [listOpened, setListOpened] = useState(false); //떙땡땡 리스트 제어
    const anchorRef = useRef(null);//떙땡땡 버튼 ref
    const isFavorite = loginUser && favoriteDiaries && favoriteDiaries.find(v => v.id === cardDiary.id); //즐겨찾기한 게시물인지 여부
    const liked = loginUser && cardDiary.Likers && cardDiary.Likers.find(v => v.id === loginUser.id); //좋아요 눌렀는지 여부
    const [isViewMore, setViewMore] = useState(false); //더보기

    //로그아웃 또는 로그인하지 않은 사용자 처리
    useEffect(() => {
        if(!loginUser || !isLoggedIn){
            router.push('/');
            return;
        }
        return;
    }, [loginUser, isLoggingOut]);

    const onClickViewMore = () => {
        setViewMore(!isViewMore);
    }
    //즐겨찾기 등록
    const onClickFavorite = (id) => () => {
        dispatch({
            type: ONCLICK_FAVORITE_REQUEST,
            data: {
                id: id
            }
        });
    };

    //떙땡땡 리스트 제어
    const handleToggle = () => {
        setListOpened((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setListOpened(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setListOpened(false);
        }
    }
    const onClickDelete = (diaryId) => () => {
        dispatch({
            type: DELETE_DIARY_REQUEST,
            data: diaryId,
        });
        return;
    }
    const onClickEdit = (diaryId) => () => {
        Router.push({
            pathname: '/editDiary',
            query: { id: diaryId},
            as:`/editDiary/${diaryId}`,
        });
        return;
    };
    //신고버튼
    const onClickReport = () => {
        return alert('신고가 접수되었습니다.');
    }
    const onClickLike = useCallback(() => {
        if(!loginUser) {
            router.push('/');
            return alert('로그인이 필요합니다.');
        }
        if(liked){ //좋아요를 누른 상태
            dispatch({
                type: UNLIKE_DIARY_REQUEST,
                data: cardDiary.id,
            })
        } else{ //좋아요를 누르지 않은 상태
            dispatch({
                type: LIKE_DIARY_REQUEST,
                data: cardDiary.id,
            });
        }
    }, [loginUser && loginUser.id, cardDiary && cardDiary.id, liked]);

    return (
        <Card className={classes.root}>
            <CardHeader
                // 아바타
                avatar={
                    <Link href={{ pathname: '/user', query: { userId: cardDiary.UserId}}} as={`/user/${cardDiary.UserId}`}><a>
                        <Avatar
                            aria-label="recipe"
                            className={classes.avatar}
                            src={ cardDiary.User && cardDiary.User.ProfileImage ? `${cardDiary.User.ProfileImage[0].src}` :  null}
                        >
                        </Avatar>
                    </a></Link>
                }
                // 땡땡땡 옵션
                action={
                    <IconButton aria-label="settings" onClick={handleToggle} ref={anchorRef}>
                        <MoreVertIcon />
                    </IconButton>
                }
                // 제목
                title={cardDiary.diaryTitle && cardDiary.diaryTitle.length > 12 ? cardDiary.diaryTitle.slice(0,12) + " ..." : cardDiary.diaryTitle}

                // 날짜
                subheader={moment(cardDiary.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
            />
            <Popper open={listOpened} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                {
                                    (loginUser.id === diary.UserId)
                                        ?
                                        <MenuList autoFocusItem={listOpened} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                            <MenuItem onClick={onClickDelete(diary.id)}><DeleteIcon style={{marginRight:10}}/> 삭제 </MenuItem>
                                            <MenuItem onClick={onClickEdit(diary.id)}><BorderColorIcon style={{marginRight:10}} /> 수정 </MenuItem>
                                        </MenuList>
                                        :
                                        <MenuList autoFocusItem={listOpened} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                            <MenuItem onClick={onClickReport}><AnnouncementIcon style={{marginRight:10}} />신고</MenuItem>
                                        </MenuList>
                                }
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            {/*사진*/}
            <div className="carousel-wrapper"  >
                <Carousel infiniteLoop showThumbs={false} >
                    {cardDiary.Images && cardDiary.Images.map((v, i) => (
                        <div key={v.id} style={{height: 'auto'}}><img src={`${cardDiary.Images[i].src}`}/></div>
                        ))}
                </Carousel>
            </div>
            {/*내용*/}
            <CardContent>
                {!isViewMore ?
                    <Typography variant="body2" color="textSecondary" component="p" style={{fontSize:"1em"}}>
                    {cardDiary.diaryContent && cardDiary.diaryContent.slice(0,400).split(/(#[^\s]+)/g).map((v) => {
                        if(v.match(/#[^\s]+/)){
                            return (
                                <Link href={{ pathname: '/hashtag', query: {tag: v.slice(1)}}} as={`/diary/hashtag/${v.slice(1)}`} key={v}><a>{v}</a></Link>
                            );
                        }
                        return v;
                    })}
                    {cardDiary.diaryContent && cardDiary.diaryContent.length > 400
                    ?
                        <a href="#" onClick={onClickViewMore}> ...더보기</a>
                    : ""}
                </Typography>
                :
                <Typography variant="body2" color="textSecondary" component="p">{cardDiary.diaryContent && cardDiary.diaryContent.split(/(#[^\s]+)/g).map((v) => {
                    if(v.match(/#[^\s]+/)){
                        return (
                            <Link href={{ pathname: '/hashtag', query: {tag: v.slice(1)}}} as={`/diary/hashtag/${v.slice(1)}`} key={v}><a>{v}</a></Link>
                        );
                    }
                    return v;
                })}}
                    <a onClick={onClickViewMore}>접기</a>
                </Typography>}
            </CardContent>

            <CardActions disableSpacing>
                {/*하트 아이콘*/}
                <IconButton aria-label="add to favorites" color="secondary" onClick={onClickLike}>
                    {!liked
                        ? <FavoriteBorderRoundedIcon fontSize="large"/>
                        : <FavoriteIcon fontSize="large" />
                    }

                </IconButton>
                {/*별 아이콘*/}
                {loginUser && loginUser.id === cardDiary.UserId &&
                <IconButton aria-label="share" onClick={onClickFavorite(cardDiary.id)}>
                    {isFavorite
                        ? <StarRoundedIcon fontSize="large" color="inherit" className={classes.starIcon}/>
                        : <StarBorderRoundedIcon fontSize="large" color="inherit" className={classes.starIcon}/>
                    }
                </IconButton>
                }
                {/*공유 아이콘*/}
                {/*<IconButton aria-label="share">*/}
                {/*    <ShareIcon />*/}
                {/*</IconButton>*/}
            </CardActions>
        </Card>
    );
}

cardDiaryDetails.getInitialProps = (context) => {
    let userId = 0;
    const queryId = context.query.id && parseInt(context.query.id, 10);

    if(queryId){
        userId = queryId;
    }

    context.store.dispatch({
        type: LOAD_DIARY_REQUEST,
        data: context.query.id,
    });
    context.store.dispatch({
        type: CHANGE_CURRENTPAGE_REQUEST,
        data: 'diary details',
    });

    context.store.dispatch({
        type: LOAD_FAVORITE_REQUEST,
        data: userId,
    });
    return { id: parseInt(context.query.id, 10) };
};

export default cardDiaryDetails;