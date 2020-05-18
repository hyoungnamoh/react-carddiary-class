import React, {Component, createRef,} from "react";
import {Avatar, Button, TextField} from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import DoneIcon from "@material-ui/icons/Done";
import {withStyles} from "@material-ui/core/styles";

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
}


class MyInfoEdit extends Component {
    constructor(props) {
        super(props);
        this.imageInput = createRef();
    }

    user = this.props.personalUser ? this.props.personalUser : this.props.loginUser; //페이지가 자기 페이지인지, 다른 유저 페이지인지 구분해서 user 분기처리

    state = {
        editEmail:this.user.email && this.user.email,
        editUserName:this.user.userName && this.user.userName,
        editPassword:'',
        editPasswordConfirm:'',
        userProfileImage: this.props.loginUser.ProfileImage[0] && this.props.loginUser.ProfileImage[0].src,
    }

    onChangeEditEmail = (e) => {
        this.setState({editEmail: e.target.value});
    };

    onChangeEditUserName = (e) => {
        this.setState({editUserName: e.target.value});
    };

    onChangeEditPassword = (e) => {
        this.setState({editPassword: e.target.value});
    };

    onChangeEditPasswordConfirm = (e) => {
        this.setState({editPasswordConfirm: e.target.value});
    };

    onClickEmail = () => {
        return alert('이메일은 변경이 불가능합니다.');
    };
    //
    //이미지 업로드 버튼 클릭
    onClickImageUpload = () => {
        this.imageInput.current.click();
    };

    render() {
        return (
            <>
                <Button style={{float:"right"}} onClick={this.props.onEditCancel}><ClearIcon /></Button>
                <Button style={{float:"right"}} onClick={() => {
                    this.props.onComplete(this.state.editUserName, this.state.editEmail, this.state.editPassword, this.state.editPasswordConfirm, this.props.profileImagePath);
                }}><DoneIcon /></Button>
                <div>내 정보 페이지 </div>
                <div>
                        <Avatar
                            alt="Remy Sharp"
                            src={ this.props.profileImagePath ?  this.props.profileImagePath : this.state.userProfileImage  ? this.state.userProfileImage : this.state.userProfileImage}
                            // src={null}
                            className={this.props.classes.avatar}
                            onClick={this.onClickImageUpload}
                        />
                    <input type="file" multiple hidden ref={this.imageInput} onChange={(e) => {
                        this.props.onChangeImages(e);
                    }}/>
                </div>
                {/*내 정보 텍스트 필드*/}
                <div className={this.props.classes.textFieldWrapper}>
                    <TextField required id="standard-required-email" label="이메일" value={this.state.editEmail} onClick={this.onClickEmail} className={this.props.classes.textFields} onChange={this.onChangeEditEmail} disabled/>
                    <TextField required id="standard-required-name" label="이름" value={this.state.editUserName} className={this.props.classes.textFields} onChange={this.onChangeEditUserName}/>
                    <TextField
                        id="standard-password-input"
                        label="비밀번호"
                        type="password"
                        value={this.state.editPassword}
                        className={this.props.classes.textFields}
                        onChange={this.onChangeEditPassword}
                    />
                    <TextField
                        id="standard-password-confirm-input"
                        label="비밀번호 확인"
                        type="password"
                        className={this.props.classes.textFields}
                        value={this.state.editPasswordConfirm}
                        onChange={this.onChangeEditPasswordConfirm}
                    />
                </div>
            </>
        );
    }
}

export default withStyles(styles)(MyInfoEdit);