import {connect} from "react-redux";
import MyInfo from "../components/MyInfo";
import {
    ADD_FOLLOW_REQUEST,
    REMOVE_FOLLOW_REQUEST,
    REQUEST_INIT_FOLLOWED,
    USER_EDITFORM_REQUEST
} from "../reducers/user";

const mapStateToProps = (state) => {
    const {isEditing, profileImagePath, personalUser, loginUser, followingList, isFollowedUser} = state.user;
    return {
        isEditing,
        profileImagePath,
        personalUser,
        loginUser,
        followingList,
        isFollowedUser,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        //수정하기 버튼
        onEdit: () => {
            dispatch({
                type: USER_EDITFORM_REQUEST
            });
        },

        //팔로우 버튼
        onClickFollow: (userId, isFollowedUser) => {
            if(!isFollowedUser){
                dispatch({
                    type: ADD_FOLLOW_REQUEST,
                    data: userId,
                });
                // setIsFollowedUser(true);
            } else{
                dispatch({
                    type: REMOVE_FOLLOW_REQUEST,
                    data: userId,
                });
                // setIsFollowedUser(false);
            }
            return;
        },

        initFollowed: (init) => {
            dispatch({
                type: REQUEST_INIT_FOLLOWED,
                data: init,
            });
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MyInfo);