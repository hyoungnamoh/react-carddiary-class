import {connect} from "react-redux";
import MyInfo from "../components/MyInfo";
import {
    ADD_FOLLOW_REQUEST, EDIT_USER_REQUEST,
    REMOVE_FOLLOW_REQUEST,
    REQUEST_INIT_FOLLOWED, UPLOAD_PROFILE_REQUEST,
    USER_EDITFORM_REQUEST
} from "../reducers/user";
import MyInfoEdit from "../components/MyInfoEdit";

//정규표현식
const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
const nameRegex = /^[가-힣]{1,4}$/;
const passwordRegExp = /^[a-zA-z0-9]{8,20}$/;

const mapStateToProps = (state) => {
    const {isEditing, profileImagePath, personalUser} = state.user;
    return {
        isEditing,
        profileImagePath,
        personalUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        onComplete: (editUserName, editEmail, editPassword, editPasswordConfirm, profileImagePath) => {
            if(!editUserName){
                return alert('변경할 이름을 입력해주세요.');
            }
            if(!editPassword){
                return alert('변결할 비밀번호를 입력해주세요.');
            }
            if(!editPasswordConfirm){
                return alert('변결할 비밀번호를 두번 입력해주세요.');
            }
            if(!emailRegex.test(editEmail)){
                return alert('이메일 형식이 올바르지 않습니다.');
            }
            if(!passwordRegExp.test(editPassword)){
                return alert('비밀번호는 영문 숫자 혼용하여 8~20자 입력해주세요.');
            }
            if(editPassword !== editPasswordConfirm){
                return alert('같은 비밀번호를 두번 입력해주세요.');
            }
            dispatch({
                type: EDIT_USER_REQUEST,
                data:{
                    userName: editUserName,
                    email: editEmail,
                    password: editPassword,
                    profileImagePath: profileImagePath ? profileImagePath : userProfileImage,
                }
            });
            dispatch({
                type: USER_EDITFORM_REQUEST
            });
        },
        //실제로 이미지 업로드 했을 때
        onChangeImages: (e) => {
            const imageFormData = new FormData();
            [].forEach.call(e.target.files, (f) => {
                imageFormData.append('image', f);
            });
            dispatch({
                type: UPLOAD_PROFILE_REQUEST,
                data: imageFormData,
            })
        },
        onEditCancel: () => {
            dispatch({
                type: USER_EDITFORM_REQUEST
            })
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyInfoEdit);