import React, {useCallback, useRef, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import CardActions from "@material-ui/core/CardActions";
import FavoriteBorderRoundedIcon from "@material-ui/icons/FavoriteBorderRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import {Card, ClickAwayListener, Grid, Grow, MenuList, Paper, Popper} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import MenuItem from '@material-ui/core/MenuItem';
import StarRoundedIcon from '@material-ui/icons/StarRounded';
import FavoriteIcon from '@material-ui/icons/Favorite';
import {
    DELETE_DIARY_REQUEST,
    LIKE_DIARY_REQUEST,
    ONCLICK_FAVORITE_REQUEST,
    UNLIKE_DIARY_REQUEST
} from "../reducers/diary";
import {Carousel} from "react-responsive-carousel";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import DeleteIcon from '@material-ui/icons/Delete';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import Router, {useRouter} from 'next/router'
import moment from "moment";
import {mainCardDiaryStyle} from "../styles/MainCardDiaryStyle";


const MainCardDiary = ({diary}) => {
    const classes = mainCardDiaryStyle();
    const dispatch = useDispatch();
    const { personalUser, loginUser} = useSelector(state => state.user);
    const {cardDiaries, favoriteDiaries} = useSelector(state => state.diary);
    const router = useRouter();
    const isFavorite = loginUser && favoriteDiaries && favoriteDiaries.find(v => v.id === diary.id);
    const [isOpenedCarousel, setIsOpenedCarousel] = useState(false); //carousel 제어
    const [listOpened, setListOpened] = useState(false); //떙땡땡 리스트 제어
    const anchorRef = useRef(null);//떙땡땡 버튼 ref
    const liked = loginUser && diary.Likers && diary.Likers.find(v => v.id === loginUser.id);

    //사진
    const onCarousel = useCallback(() => {
        setIsOpenedCarousel(true);
    }, [isOpenedCarousel]);
    const onCloseCarousel = useCallback(() => {
        setIsOpenedCarousel(false);
    }, [isOpenedCarousel]);

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

    const onClickLike = useCallback(() => {
        if(!loginUser) {
            router.push('/');
            return alert('로그인이 필요합니다.');
        }
        if(liked){ //좋아요를 누른 상태
            dispatch({
                type: UNLIKE_DIARY_REQUEST,
                data: diary.id,
            })
        } else{ //좋아요를 누르지 않은 상태
            dispatch({
                type: LIKE_DIARY_REQUEST,
                data: diary.id,
            });
        }
    }, [loginUser && loginUser.id, diary && diary.id, liked]);

    //신고버튼
    const onClickReport = () => {
        return alert('신고가 접수되었습니다.');
    }
    return (
        <Grid item>
            <Card className={classes.root}>
                <CardHeader
                    // 아바타
                    avatar={
                        // 아니 href 안에 query:{userId: diary.UserId} 로 바꾸면 왜 안되는거지? 진짜 어이없네
                        <Link href={{ pathname: '/user', query: { userId: diary.UserId}}} as={`/user/${diary.UserId}`}><a>
                            <Avatar
                                aria-label="recipe"
                                className={classes.avatar}
                                src={ diary && diary.User.ProfileImage ? `${diary.User.ProfileImage[0].src}` :  null}
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
                    title={diary.diaryTitle && diary.diaryTitle.length > 35
                        ?
                            <Link href={{ pathname: '/cardDiaryDetails', query: { id: diary.id}}} as={`/diary/${diary.id}`}><a>
                                {diary.diaryTitle.slice(0,35)+ " ..."}
                            </a></Link>
                        :
                            <Link href={{ pathname: '/cardDiaryDetails', query: { id: diary.id}}} as={`/diary/${diary.id}`}><a>
                                {diary.diaryTitle}
                            </a></Link>}

                    // 날짜
                    subheader={moment(diary.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
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
                <CardMedia
                    className={classes.media}
                    image={`${diary.Images[0] && diary.Images[0].src}`}
                    title={diary.diaryTitle && diary.diaryTitle}
                    onClick={onCarousel}
                />
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={isOpenedCarousel}
                    onClose={onCloseCarousel}
                    closeAfterTransition
                >
                    <Fade in={isOpenedCarousel}>
                        <div className="carousel-wrapper" >
                            <Carousel
                            >
                                {diary.Images && diary.Images.map((v, i) => (
                                    <div key={v}><img  src={`${diary.Images[i].src}`}/></div>
                                ))}
                            </Carousel>
                        </div>
                    </Fade>
                </Modal>
                <CardContent >
                    <Typography variant="body2" color="textSecondary" component="p">
                        {diary.diaryContent && diary.diaryContent.slice(0,220).split(/(#[^\s]+)/g).map((v) => {
                            if(v.match(/#[^\s]+/)){
                                return (
                                    <Link href={{ pathname: '/hashtag', query: {tag: v.slice(1)}}} as={`/diary/hashtag/${v.slice(1)}`} key={v}><a>{v}</a></Link>
                                );
                            }
                            return v;
                        })}
                        {diary.diaryContent && diary.diaryContent.length > 220
                            ? <Link href={{ pathname: '/cardDiaryDetails', query: { id: diary.id}}} as={`/diary/${diary.id}`}><a>...자세히보기</a></Link>
                            : ""}
                    </Typography>
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
                    {loginUser && loginUser.id === diary.UserId &&
                    <IconButton aria-label="share" onClick={onClickFavorite(diary.id)}>
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
        </Grid>
    );
}

export default MainCardDiary;