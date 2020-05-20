import {connect} from "react-redux";
import MyInfo from "../components/MyInfo";
import {
    ADD_FOLLOW_REQUEST,
    REMOVE_FOLLOW_REQUEST,
    REQUEST_INIT_FOLLOWED,
    USER_EDITFORM_REQUEST
} from "../reducers/user";
import MainCardDiary from "../components/MainCardDiary";
import {
    DELETE_DIARY_REQUEST,
    LIKE_DIARY_REQUEST,
    ONCLICK_FAVORITE_REQUEST,
    UNLIKE_DIARY_REQUEST
} from "../reducers/diary";

const mapStateToProps = (state) => {
    const {personalUser, loginUser} = state.user;
    const {cardDiaries, favoriteDiaries} = state.diary;
    return {
        personalUser,
        loginUser,
        cardDiaries,
        favoriteDiaries,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        //즐겨찾기 등록
        onClickFavorite: (id) => {
            dispatch({
                type: ONCLICK_FAVORITE_REQUEST,
                data: {
                    id: id
                }
            });
        },
        onClickDelete: (diaryId) => {
            dispatch({
                type: DELETE_DIARY_REQUEST,
                data: diaryId,
            });
            return;
        },
        onClickLike: (diary, liked) => {
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
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(MainCardDiary);