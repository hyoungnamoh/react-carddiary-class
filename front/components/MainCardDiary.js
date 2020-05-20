import React, {Component, createRef, useCallback, useRef, useState} from "react";
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
import {makeStyles} from "@material-ui/core/styles";
import { withRouter } from 'next/router'
import {red, yellow} from "@material-ui/core/colors";
import {withStyles} from "@material-ui/styles";

const minWidth = 1000;
const styles =  {
    root: {
        width:'50vw',
        height: '100%',
        maxWidth: '800px',
        // maxHeight: '750px',
        marginBottom:"3%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    },
    starIcon:{
        color: yellow[700],
    },
    modal: {
        marginLeft: '27%',
        marginTop: '15%',
        maxWidth: '750px',
        maxHeight: '750px',
        width: '60%',
        height: '60%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    [`@media (max-width: ${minWidth}px)`]: {
        root: {
            width:'80vw',
        },
    },
};

class MainCardDiary extends Component{
    constructor(props) {
        super(props);
        this.anchorRef = createRef();
        console.log(props);
    }

    state = {
        isOpenedCarousel: false,
        listOpened: false,
        liked: this.props.loginUser && this.props.diary.Likers && this.props.diary.Likers.find(v => v.id === this.props.loginUser.id),
        isFavorite: this.props.loginUser && this.props.favoriteDiaries && this.props.favoriteDiaries.find(v => v.id === this.props.diary.id),
    }

    // const router = useRouter();



    //
    // //사진
    onCarousel = () => {
        this.setState({isOpenedCarousel: true});
    };
    onCloseCarousel = () => {
        this.setState({isOpenedCarousel: false});
    };

    //떙땡땡 리스트 제어
    handleToggle = () => {
        this.setState({listOpened: !this.state.listOpened});
    };
    //
    handleClose = (event) => {
        if (this.anchorRef.current && this.anchorRef.current.contains(event.target)) {
            return;
        }
        this.setState({listOpened: false});
    };
    //
    handleListKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            this.setState({listOpened: false});
        }
    }
    //

    onClickEdit = (diaryId) => () => {
        this.props.router.push({
            pathname: '/editDiary',
            query: { id: diaryId},
            as:`/editDiary/${diaryId}`,
        });
        return;
    };
    //

    //
    //신고버튼
    onClickReport = () => {
        return alert('신고가 접수되었습니다.');
    }
    render() {
        return (
            <Grid item>
                <Card className={this.props.classes.root}>
                    <CardHeader
                        // 아바타
                        avatar={
                            // 아니 href 안에 query:{userId: diary.UserId} 로 바꾸면 왜 안되는거지? 진짜 어이없네
                            <Link href={{ pathname: '/user', query: { userId: this.props.diary.UserId}}} as={`/user/${this.props.diary.UserId}`}><a>
                                <Avatar
                                    aria-label="recipe"
                                    className={this.props.classes.avatar}
                                    src={ this.props.diary && this.props.diary.User.ProfileImage ? `${this.props.diary.User.ProfileImage[0].src}` :  null}
                                >
                                </Avatar>
                            </a></Link>
                        }
                        // 땡땡땡 옵션
                        action={
                            <IconButton aria-label="settings" onClick={this.handleToggle} ref={this.anchorRef}>
                                <MoreVertIcon />
                            </IconButton>
                        }
                        // 제목
                        title={this.props.diary.diaryTitle && this.props.diary.diaryTitle.length > 35
                            ?
                                <Link href={{ pathname: '/cardDiaryDetails', query: { id: this.props.diary.id}}} as={`/diary/${this.props.diary.id}`}><a>
                                    {this.props.diary.diaryTitle.slice(0,35)+ " ..."}
                                </a></Link>
                            :
                                <Link href={{ pathname: '/cardDiaryDetails', query: { id: this.props.diary.id}}} as={`/diary/${this.props.diary.id}`}><a>
                                    {this.props.diary.diaryTitle}
                                </a></Link>}

                        // 날짜
                        subheader={moment(this.props.diary.createdAt).format('MMMM Do YYYY, h:mm:ss a')}
                    />
                    <Popper open={this.state.listOpened} anchorEl={this.anchorRef.current} role={undefined} transition disablePortal>
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={this.handleClose}>
                                        {
                                            (this.props.loginUser.id === this.props.diary.UserId)
                                                ?
                                                <MenuList autoFocusItem={this.props.listOpened} id="menu-list-grow" onKeyDown={this.handleListKeyDown}>
                                                    <MenuItem onClick={() => {
                                                        this.props.onClickDelete(this.props.diary.id);}
                                                    }><DeleteIcon style={{marginRight:10}}/> 삭제 </MenuItem>
                                                    <MenuItem onClick={this.onClickEdit(this.props.diary.id)}><BorderColorIcon style={{marginRight:10}} /> 수정 </MenuItem>
                                                </MenuList>
                                                :
                                                <MenuList autoFocusItem={this.props.listOpened} id="menu-list-grow" onKeyDown={this.handleListKeyDown}>
                                                    <MenuItem onClick={this.onClickReport}><AnnouncementIcon style={{marginRight:10}} />신고</MenuItem>
                                                </MenuList>
                                        }
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                    {/*사진*/}
                    <CardMedia
                        className={this.props.classes.media}
                        image={`${this.props.diary.Images[0] && this.props.diary.Images[0].src}`}
                        title={this.props.diary.diaryTitle && this.props.diary.diaryTitle}
                        onClick={this.onCarousel}
                    />
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={this.props.classes.modal}
                        open={this.state.isOpenedCarousel}
                        onClose={this.onCloseCarousel}
                        closeAfterTransition
                    >
                        <Fade in={this.state.isOpenedCarousel}>
                            <div className="carousel-wrapper" >
                                <Carousel
                                >
                                    {this.props.diary.Images && this.props.diary.Images.map((v, i) => (
                                        <div key={v}><img  src={`${this.props.diary.Images[i].src}`}/></div>
                                    ))}
                                </Carousel>
                            </div>
                        </Fade>
                    </Modal>
                    <CardContent >
                        <Typography variant="body2" color="textSecondary" component="p">
                            {this.props.diary.diaryContent && this.props.diary.diaryContent.slice(0,220).split(/(#[^\s]+)/g).map((v) => {
                                if(v.match(/#[^\s]+/)){
                                    return (
                                        <Link href={{ pathname: '/hashtag', query: {tag: v.slice(1)}}} as={`/diary/hashtag/${v.slice(1)}`} key={v}><a>{v}</a></Link>
                                    );
                                }
                                return v;
                            })}
                            {this.props.diary.diaryContent && this.props.diary.diaryContent.length > 220
                                ? <Link href={{ pathname: '/cardDiaryDetails', query: { id: this.props.diary.id}}} as={`/diary/${this.props.diary.id}`}><a>...자세히보기</a></Link>
                                : ""}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        {/*하트 아이콘*/}
                        <IconButton aria-label="add to favorites" color="secondary" onClick={ () => {
                            this.props.onClickLike(this.props.diary, this.state.liked);
                        }}>
                            {!this.state.liked
                                ? <FavoriteBorderRoundedIcon fontSize="large"/>
                                : <FavoriteIcon fontSize="large" />
                            }

                        </IconButton>
                        {/*별 아이콘*/}
                        {this.props.loginUser && this.props.loginUser.id === this.props.diary.UserId &&
                        <IconButton aria-label="share" onClick={() => {
                            this.props.onClickFavorite(this.props.diary.id);
                        }}>
                            {this.state.isFavorite
                                ? <StarRoundedIcon fontSize="large" color="inherit" className={this.props.classes.starIcon}/>
                                : <StarBorderRoundedIcon fontSize="large" color="inherit" className={this.props.classes.starIcon}/>
                            }
                        </IconButton>
                        }
                    </CardActions>
                </Card>
            </Grid>
        );

    }
}

export default withStyles(styles)(withRouter(MainCardDiary));