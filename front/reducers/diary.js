import produce from 'immer';

export const initialState = {
    imagePaths:[], //이미지 경로
    loginUserCardDiaries:[], //다이어리들
    cardDiaries:[], //다이어리들
    cardDiary:{}, //개별 다이어리
    isRequestingDiary: false, //프로그래스바 로딩중
    diaryAdded: false, //글작성 완료(route)
    favoriteDiaries:[], //별 누른 다이어리들
    hasMoreDiary: false, //더 불러올 다이어리가 있는지
    hashtagDiaries: [], //해시태그 게시물들
    filteredDiaries: [], //즐겨찾기만 볼 때, 검색할 때
};

//이미지 업로드하는 액션
export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

//다이어리 업로드하는 액션
export const ADD_DIARY_REQUEST = 'ADD_DIARY_REQUEST';
export const ADD_DIARY_SUCCESS = 'ADD_DIARY_SUCCESS';
export const ADD_DIARY_FAILURE = 'ADD_DIARY_FAILURE';

//자신의 다이어리들 가져오는 액션
export const LOAD_USER_DIARIES_REQUEST = 'LOAD_USER_DIARIES_REQUEST';
export const LOAD_USER_DIARIES_SUCCESS = 'LOAD_USER_DIARIES_SUCCESS';
export const LOAD_USER_DIARIES_FAILURE = 'LOAD_USER_DIARIES_FAILURE';

//즐겨찾기 별 누르는 액션
export const ONCLICK_FAVORITE_REQUEST = 'ONCLICK_FAVORITE_REQUEST';
export const ONCLICK_FAVORITE_SUCCESS = 'ONCLICK_FAVORITE_SUCCESS';
export const ONCLICK_FAVORITE_FAILURE = 'ONCLICK_FAVORITE_FAILURE';

//첫 로딩 시 즐겨찾기 가져오는 액션
export const LOAD_FAVORITE_REQUEST = 'LOAD_FAVORITE_REQUEST';
export const LOAD_FAVORITE_SUCCESS = 'LOAD_FAVORITE_SUCCESS';
export const LOAD_FAVORITE_FAILURE = 'LOAD_FAVORITE_FAILURE';

//완료 후 다시 added 초기화 해주는 액션
export const ADDED_DAIRY_SWITCHING = 'ADDED_DAIRY_SWITCHING';

//다이어리 하나 불러오는 액션
export const LOAD_DIARY_REQUEST = 'LOAD_DIARY_REQUEST';
export const LOAD_DIARY_SUCCESS = 'LOAD_DIARY_SUCCESS';
export const LOAD_DIARY_FAILURE = 'LOAD_DIARY_FAILURE';

//메인 다이어리 가져오는 액션
export const LOAD_DIARIES_REQUEST = 'LOAD_DIARIES_REQUEST';
export const LOAD_DIARIES_SUCCESS = 'LOAD_DIARIES_SUCCESS';
export const LOAD_DIARIES_FAILURE = 'LOAD_DIARIES_FAILURE';

//다이어리 삭제하는 액션
export const DELETE_DIARY_REQUEST = 'DELETE_DIARY_REQUEST';
export const DELETE_DIARY_SUCCESS = 'DELETE_DIARY_SUCCESS';
export const DELETE_DIARY_FAILURE = 'DELETE_DIARY_FAILURE';

//다이어리 수정하는 액션
export const EDIT_DIARY_REQUEST = 'EDIT_DIARY_REQUEST';
export const EDIT_DIARY_SUCCESS = 'EDIT_DIARY_SUCCESS';
export const EDIT_DIARY_FAILURE = 'EDIT_DIARY_FAILURE';

//해시태그 다이어리 가져오는 액션
export const LOAD_HASHTAG_REQUEST = 'LOAD_HASHTAG_REQUEST';
export const LOAD_HASHTAG_SUCCESS = 'LOAD_HASHTAG_SUCCESS';
export const LOAD_HASHTAG_FAILURE = 'LOAD_HASHTAG_FAILURE';

//좋아요 누르는 액션
export const LIKE_DIARY_REQUEST = 'LIKE_DIARY_REQUEST';
export const LIKE_DIARY_SUCCESS = 'LIKE_DIARY_SUCCESS';
export const LIKE_DIARY_FAILURE = 'LIKE_DIARY_FAILURE';

//좋아요 취소하는 액션
export const UNLIKE_DIARY_REQUEST = 'UNLIKE_DIARY_REQUEST';
export const UNLIKE_DIARY_SUCCESS = 'UNLIKE_DIARY_SUCCESS';
export const UNLIKE_DIARY_FAILURE = 'UNLIKE_DIARY_FAILURE';

const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case UPLOAD_IMAGES_REQUEST: {
                draft.imagePaths = [];
                break;
            }
            case UPLOAD_IMAGES_SUCCESS: {
                action.data.forEach((p) => {
                    draft.imagePaths.push(p);
                });
                break;
            }
            case UPLOAD_IMAGES_FAILURE: {
                break;
            }
            case ADD_DIARY_REQUEST: {
                draft.isRequestingDiary = true;
                draft.diaryAdded = false;
                break;
            }
            case ADD_DIARY_SUCCESS: {
                draft.cardDiaries.unshift(action.data);
                draft.imagePaths = [];
                draft.isRequestingDiary = false;
                draft.diaryAdded = true;
                break;
            }
            case ADD_DIARY_FAILURE: {
                draft.isRequestingDiary = false;
                break;
            }
            case ADDED_DAIRY_SWITCHING: {
                draft.diaryAdded = false;
            }
            case LOAD_USER_DIARIES_REQUEST: {
                draft.cardDiaries=[];
                draft.cardDiary={};
                draft.loginUserCardDiaries = !action.lastId ? [] : draft.loginUserCardDiaries;
                draft.hasMoreDiary = action.lastId ? draft.hasMoreDiary : true;
                break;
            }
            case LOAD_USER_DIARIES_SUCCESS: {
                action.data.forEach((diary) => {
                    draft.loginUserCardDiaries.push(diary);
                });
                draft.hasMoreDiary = action.data.length === 9;
                break;
            }
            case LOAD_USER_DIARIES_FAILURE: {
                break;
            }
            case LOAD_FAVORITE_REQUEST:
            case ONCLICK_FAVORITE_REQUEST: {
                break;
            }
            case LOAD_FAVORITE_SUCCESS:
            case ONCLICK_FAVORITE_SUCCESS: {
                draft.favoriteDiaries = action.data;
                break;
            }
            case LOAD_FAVORITE_FAILURE:
            case ONCLICK_FAVORITE_FAILURE: {
                break;
            }
            case LOAD_DIARY_REQUEST: {
                draft.loginUserCardDiaries=[];
                draft.cardDiaries=[];
                break;
            }
            case LOAD_DIARY_SUCCESS: {
                draft.cardDiary = action.data;
                break;
            }
            case LOAD_DIARY_FAILURE: {
                break;
            }
            case LOAD_DIARIES_REQUEST: {
                draft.isRequestingDiary = true;
                draft.loginUserCardDiaries=[];
                draft.cardDiary={};
                draft.cardDiaries = !action.lastId ? [] : draft.cardDiaries;
                draft.hasMoreDiary = action.lastId ? draft.hasMoreDiary : true;
                break;
            }
            case LOAD_DIARIES_SUCCESS: {
                action.data.forEach((diary) => {
                    draft.cardDiaries.push(diary);
                });
                draft.hasMoreDiary = action.data.length === 5;
                draft.isRequestingDiary = false;
                break;
            }
            case LOAD_DIARIES_FAILURE: {
                draft.isRequestingDiary = false;
                break;
            }
            case DELETE_DIARY_REQUEST: {
                break;
            }
            case DELETE_DIARY_SUCCESS: {
                if(draft.loginUserCardDiaries.length !== 0){
                    const index = draft.loginUserCardDiaries.findIndex(v => v.id === action.data);
                    draft.loginUserCardDiaries.splice(index, 1);
                    break;
                }
                const index = draft.cardDiaries.findIndex(v => v.id === action.data);
                draft.cardDiaries.splice(index, 1);
                break;
            }
            case DELETE_DIARY_FAILURE: {
                break;
            }
            case EDIT_DIARY_REQUEST: {
                draft.isRequestingDiary = true;
                draft.diaryAdded = false;
                break;
            }
            case EDIT_DIARY_SUCCESS: {
                draft.imagePaths = [];
                draft.isRequestingDiary = false;
                draft.diaryAdded = true;
                break;
            }
            case EDIT_DIARY_FAILURE: {
                draft.isRequestingDiary = false;
                break;
            }
            case LOAD_HASHTAG_REQUEST: {
                draft.hashtagDiaries = !action.lastId ? [] : draft.hashtagDiaries;
                draft.hasMoreDiary = action.lastId ? draft.hasMoreDiary : true;
                break;
            }
            case LOAD_HASHTAG_SUCCESS: {
                action.data.forEach((diary) => {
                    draft.hashtagDiaries.push(diary);
                });
                draft.hasMoreDiary = action.data.length === 20;
                break;
            }
            case LOAD_HASHTAG_FAILURE: {
                break;
            }
            case LIKE_DIARY_REQUEST: {
                break;
            }
            case LIKE_DIARY_SUCCESS: {
                if(draft.loginUserCardDiaries.length !== 0){ //유저페이지에 게시글 좋아요 눌렀을 때
                    const diaryIndex = draft.loginUserCardDiaries.findIndex(v => v.id === action.data.diaryId);
                    draft.loginUserCardDiaries[diaryIndex].Likers.unshift({ id: action.data.userId });
                    break;
                }
                if(draft.cardDiaries.length !== 0){//메인페이지 게시글 좋아요 눌렀을 때
                    const diaryIndex = draft.cardDiaries.findIndex(v => v.id === action.data.diaryId);
                    draft.cardDiaries[diaryIndex].Likers.unshift({ id: action.data.userId });
                    break;
                }
                //개별다이어리 좋아요 눌렀을 때
                draft.cardDiary.Likers.unshift({ id: action.data.userId });
                break;

            }
            case LIKE_DIARY_FAILURE: {
                break;
            }
            case UNLIKE_DIARY_REQUEST: {
                break;
            }
            case UNLIKE_DIARY_SUCCESS: {
                if(draft.loginUserCardDiaries.length !== 0){
                    const diaryIndex = draft.loginUserCardDiaries.findIndex(v => v.id === action.data.diaryId);
                    const likeIndex = draft.loginUserCardDiaries[diaryIndex].Likers.findIndex(v => v.id === action.data.userId);
                    draft.loginUserCardDiaries[diaryIndex].Likers.splice(likeIndex, 1);
                    break;
                }
                if(draft.cardDiaries.length !== 0){ //메인 게시물 좋아요 눌렀을 때
                    const diaryIndex = draft.cardDiaries.findIndex(v => v.id === action.data.diaryId);
                    const likeIndex = draft.cardDiaries[diaryIndex].Likers.findIndex(v => v.id === action.data.userId);
                    draft.cardDiaries[diaryIndex].Likers.splice(likeIndex, 1);
                    break;
                }
                //개별다이어리 좋아요 눌렀을 때
                const likeIndex = draft.cardDiary.Likers.findIndex(v => v.id === action.data.userId);
                draft.cardDiary.Likers.splice(likeIndex, 1);
                break;
            }
            case UNLIKE_DIARY_FAILURE: {
                break;
            }
            default: {
                break;
            }
        }
    });
};
export default reducer;