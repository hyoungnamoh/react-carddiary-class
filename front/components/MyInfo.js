import React, {Component, useCallback, useEffect, useState} from "react";
import {Avatar, Button, TextField} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import dispatch from 'redux';
import {useDispatch, useSelector} from "react-redux";
import {ADD_FOLLOW_REQUEST, REMOVE_FOLLOW_REQUEST, USER_EDITFORM_REQUEST} from "../reducers/user";
import {MyInfoStyle} from '../styles/MyInfoStyle';
import {makeStyles, withStyles} from '@material-ui/core/styles';
const styles = {
    textFieldWrapper: {
        width: '90%',
        zIndex: 1,
        top: 0,
        left: 0,
    },
    textFields:{
        width:'100%',
        marginTop:'10%',
    },
    avatar:{
        width: "85%",
        height: "85%",
        marginLeft:'5%',
    },
    diariesContainer: {
        marginTop:"5%",
        marginBottom:"5%",
    }
};
class MyInfo extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        isFollowedUser: false,
    }
    componentDidMount() {
        //팔로우 한 사람이면
        if(this.props.followingList.length !== 0 && this.props.personalUser){
            const followedUser = this.props.followingList.filter(v => v.id === this.props.personalUser.id);
            this.props.initFollowed(followedUser.length !== 0);
        }
    }
    render() {
        return (
            <>
                {this.props.loginUser && (!this.props.personalUser || this.props.loginUser.id === this.props.personalUser.id) &&
                <Button style={{float: "right"}} onClick={this.props.onEdit}><EditIcon/></Button>
                }
                <div>
                    <Avatar
                        alt="Remy Sharp"
                        src={this.props.personalUser ? this.props.personalUser.ProfileImage[0].src : this.props.loginUser ? this.props.loginUser.ProfileImage[0].src : null}
                        // src={null }
                        // src={ !profileImagePath ? loginUser.ProfileImage[0].src && `http://localhost:3603/${loginUser.ProfileImage[0].src}` : `http://localhost:3603/${profileImagePath}`}
                        // className={this.props.avatar}
                        className={this.props.classes.avatar}
                    />
                </div>
                {/*내 정보 텍스트 필드*/}
                <div className={this.props.classes.textFieldWrapper}>
                    <TextField required id="standard-required-email" value={this.props.personalUser && this.props.personalUser.email}
                               className={this.props.classes.textFields} disabled/>
                    <TextField required id="standard-required-name" value={this.props.personalUser && this.props.personalUser.userName}
                               className={this.props.classes.textFields} disabled/>
                    <TextField
                        id="standard-password-input"
                        label="비밀번호"
                        type="password"
                        className={this.props.classes.textFields}
                        value='0000000000'
                        disabled
                    />
                    <TextField
                        id="standard-password-confirm-input"
                        label="비밀번호 확인"
                        type="password"
                        className={this.props.classes.textFields}
                        value='0000000000'
                        disabled
                    />
                    {this.props.loginUser && this.props.personalUser && (this.props.personalUser.id !== this.props.loginUser.id) &&
                    <Button variant="outlined" color="primary"
                            style={{marginTop: '10%', marginLeft: '25%', width: '40%'}}
                            onClick={() => {
                                this.props.onClickFollow(this.props.personalUser.id, this.props.isFollowedUser);
                            }}>
                        {this.props.isFollowedUser ? '언팔로우' : '팔로우'}
                    </Button>
                    }
                </div>
            </>
        );
    }
};

export default withStyles(styles)(MyInfo);