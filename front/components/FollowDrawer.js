import React, {useState} from "react";
import {Avatar, Button, ListItemAvatar, ListItemSecondaryAction, Tab, Tabs} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";
import {useDispatch, useSelector} from "react-redux";
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import {ADD_FOLLOW_REQUEST, REMOVE_FOLLOW_REQUEST, REQUEST_SWITCHING_DRAW} from "../reducers/user";
import Link from "next/link";
import {followDrawerStyleHide, followDrawerStylePhone, followDrawerStyleWeb} from "../styles/FollowDrawerStyle";
import {useTheme} from "@material-ui/styles";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import useMediaQuery from "@material-ui/core/useMediaQuery";


const FollowDrawer = () => {
    const isPhone = useMediaQuery('(max-width:834px)');
    const theme = useTheme();
    const dispatch = useDispatch();
    const {followingList, followerList, isOpenedDraw} = useSelector(state => state.user);
    const [drawerFollowList, setDrawerFollowList] = useState(0);
    const [open, setOpen] = useState(false);
    const classes = !isPhone ? followDrawerStyleWeb() : isOpenedDraw ? followDrawerStylePhone() : followDrawerStyleHide();

    const handleChange = (event, newValue) => {
        setDrawerFollowList(newValue);
    };

    //언팔로우 버튼 클릭
    const onClickUnFollow = (userId) => () => {
        dispatch({
            type: REMOVE_FOLLOW_REQUEST,
            data: userId,
        });
    }
    
    //팔로우 버튼 클릭
    const onClickFollow = (userId) => () => {
        dispatch({
            type: ADD_FOLLOW_REQUEST,
            data: userId,
        });
    }
    const handleDrawerClose = () => {
        dispatch({
            type:REQUEST_SWITCHING_DRAW,
        });
    };

    return (
        <>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor="right"
            >
                <div className={classes.toolbar} />
                <div className={classes.drawerHeader}>
                    {isOpenedDraw &&
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronRightIcon classNmae={classes.drawerHeaderArrow}/>
                        </IconButton>
                    }
                    <Tabs
                        value={drawerFollowList}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                        className={clsx(isPhone && classes.tabs)}
                    >
                        <Tab label="팔로워" className={clsx(isPhone && classes.tab)}/>
                        <Tab label="팔로잉" className={clsx(isPhone && classes.tab)}/>
                    </Tabs>
                </div>

                <Divider />
                <List>
                    {drawerFollowList
                        ?
                        followingList.map((v) => (
                            <div className={classes.listWrapper}>
                                <Link href={{ pathname: '/user', query: { userId: v.id}}} as={`/user/${v.id}`} key={v.id}>
                                    <ListItem button >
                                        <ListItemAvatar >
                                            <Avatar
                                                aria-label="recipe"
                                                className={classes.avatar}
                                                src={ v.ProfileImage ? `${v.ProfileImage[0].src}` :  null}
                                            />
                                        </ListItemAvatar>
                                        {/*<ListItemText primary={v.userName} />*/}
                                        <ListItemText primary={v.userName} secondary={v.email} className={classes.userInfo}/>
                                        <ListItemSecondaryAction >
                                            <Button variant="outlined" color="primary" className={classes.followButton} onClick={onClickUnFollow(v.id)}>언팔로우</Button>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Link>
                            </div>
                        ))
                        :
                        followerList.map((v) => (
                            <Link href={{ pathname: '/user', query: { userId: v.id}}} as={`/user/${v.id}`} key={v.id}>
                                <ListItem button >
                                    <ListItemAvatar className={classes.avatarWrapper}>
                                        <Avatar
                                            aria-label="recipe"
                                            className={classes.avatar}
                                            src={ v.ProfileImage ? `${v.ProfileImage[0].src}` :  null}
                                        />
                                    </ListItemAvatar>
                                    <div>
                                        <ListItemText primary={v.userName} secondary={v.email} className={classes.userInfo}/>
                                    </div>
                                    <div>
                                    {
                                        followingList.filter(f => f.id === v.id).length === 0 &&
                                        <ListItemSecondaryAction >
                                            <Button variant="outlined" color="primary" className={classes.followButton} onClick={onClickFollow(v.id)}>팔로우</Button>
                                        </ListItemSecondaryAction>
                                    }
                                    </div>
                                </ListItem>
                            </Link>
                        ))
                    }
                </List>
            </Drawer>

        </>
    );
}

export default FollowDrawer;