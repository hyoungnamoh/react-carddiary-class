import {all, fork, takeLatest, put, call, throttle} from 'redux-saga/effects';
import {

    UPLOAD_IMAGES_SUCCESS,
    UPLOAD_IMAGES_FAILURE,
    UPLOAD_IMAGES_REQUEST,
    ADD_DIARY_REQUEST,
    ADD_DIARY_FAILURE,
    ADD_DIARY_SUCCESS,
    LOAD_USER_DIARIES_REQUEST,
    LOAD_USER_DIARIES_SUCCESS,
    LOAD_USER_DIARIES_FAILURE,
    ONCLICK_FAVORITE_REQUEST,
    ONCLICK_FAVORITE_SUCCESS,
    ONCLICK_FAVORITE_FAILURE,
    LOAD_FAVORITE_REQUEST,
    LOAD_FAVORITE_SUCCESS,
    LOAD_FAVORITE_FAILURE,
    LOAD_DIARY_REQUEST,
    LOAD_DIARY_SUCCESS,
    LOAD_DIARY_FAILURE,
    LOAD_DIARIES_SUCCESS,
    LOAD_DIARIES_REQUEST,
    LOAD_DIARIES_FAILURE,
    DELETE_DIARY_REQUEST,
    DELETE_DIARY_SUCCESS,
    DELETE_DIARY_FAILURE,
    EDIT_DIARY_REQUEST,
    EDIT_DIARY_SUCCESS,
    EDIT_DIARY_FAILURE,
    LOAD_HASHTAG_REQUEST,
    LOAD_HASHTAG_FAILURE,
    LOAD_HASHTAG_SUCCESS,
    UNLIKE_DIARY_REQUEST,
    UNLIKE_DIARY_SUCCESS,
    UNLIKE_DIARY_FAILURE,
    LIKE_DIARY_REQUEST, LIKE_DIARY_SUCCESS, LIKE_DIARY_FAILURE,

} from "../reducers/diary";
import axios from 'axios';



/*
    이미지 업로드
 */
function uploadImagesAPI(formData) {
    return axios.post(`/diary/images`, formData, {
        withCredentials: true,
    });
}

function* uploadImages(action) { //action = watch함수에서 받은 req액션안에 값, dispatch할때 같이 있던 값
    try {
        const result = yield call(uploadImagesAPI, action.data);
        yield put({
            type: UPLOAD_IMAGES_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        yield put({
            type: UPLOAD_IMAGES_FAILURE,
            error: e,
        });
    }
}
function* watchUploadImages() {
    yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

/*
    다이어리 작성하기
 */
function addDiaryAPI(diaryData) {
    return axios.post('/diary', diaryData, {
        withCredentials: true,
    });
}
function* addDiary(action) {
    try {
        const result = yield call(addDiaryAPI, action.data);
        yield put({
            type:ADD_DIARY_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: ADD_DIARY_FAILURE,
            error: e,
        });
    }
}
function* watchAddPost() {
    yield takeLatest(ADD_DIARY_REQUEST, addDiary);
}

/*
    유저 다이어리들 가져오기
 */
// function loadUserDiariesAPI(id) {
//     return axios.get(`/diaries/user/${id || 0}`, {
//         withCredentials: true,
//     });
// }
function loadUserDiariesAPI(userId, lastId = 0, limit = 9) {
    return axios.get(`/diaries/user/${userId}?lastId=${lastId}&limit=${limit}`, {
        withCredentials: true,
    });
}

function* loadUserDiaries(action) {
    try {
        const result = yield call(loadUserDiariesAPI, action.data, action.lastId);
        yield put({
            type:LOAD_USER_DIARIES_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_USER_DIARIES_FAILURE,
            error: e,
        });
    }
}
function* watchLoadUserDiaries() {
    yield takeLatest(LOAD_USER_DIARIES_REQUEST, loadUserDiaries);
}
/*
    즐겨찾기 추가
 */
function onClickFavoriteAPI(diaryId) {
    return axios.patch(`/diary/favorite`, diaryId, {
        withCredentials: true,
    });
}

function* onClickFavorite(action) {
    try {
        const result = yield call(onClickFavoriteAPI, action.data);
        yield put({
            type:ONCLICK_FAVORITE_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: ONCLICK_FAVORITE_FAILURE,
            error: e,
        });
    }
}
function* watchOnclickFavorite() {
    yield takeLatest(ONCLICK_FAVORITE_REQUEST, onClickFavorite);
}

/*
    즐겨찾기 목록 가져오기
 */
function loadFavoriteAPI() {
    return axios.get(`/diaries/favorite`, {
        withCredentials: true,
    });
}

function* loadFavorite() {
    try {
        const result = yield call(loadFavoriteAPI);
        yield put({
            type:LOAD_FAVORITE_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_FAVORITE_FAILURE,
            error: e,
        });
    }
}
function* watchLoadFavorite() {
    yield takeLatest(LOAD_FAVORITE_REQUEST, loadFavorite);
}

/*
    개별 다이어리 가져오기
 */
function loadDiaryAPI(diaryId) {

    return axios.get(`/diary/${diaryId}`, {
        withCredentials: true,
    });
}

function* loadDiary(action) {
    try {
        const result = yield call(loadDiaryAPI, action.data);
        yield put({
            type:LOAD_DIARY_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_DIARY_FAILURE,
            error: e,
        });
    }
}
function* watchLoadDiary() {
    yield takeLatest(LOAD_DIARY_REQUEST, loadDiary);
}

/*
    모든 다이어리들 가져오기
 */
function loadDiariesAPI(lastId = 0, limit = 5) {
    return axios.get(`/diaries?lastId=${lastId}&limit=${limit}`, {
        withCredentials: true,
    });
}

function* loadDiaries(action) {
    try {
        const result = yield call(loadDiariesAPI, action.lastId);
        yield put({
            type:LOAD_DIARIES_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_DIARIES_FAILURE,
            error: e,
        });
    }
}
function* watchLoadDiaries() {
    yield throttle(1000, LOAD_DIARIES_REQUEST, loadDiaries);
}

/*
    다이어리 삭제하기
 */
function deleteDiaryAPI(diaryId) {
    return axios.delete(`/diary/${diaryId}`, {
        withCredentials: true,
    });
}

function* deleteDiary(action) {
    try {
        const result = yield call(deleteDiaryAPI, action.data);
        yield put({
            type:DELETE_DIARY_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: DELETE_DIARY_FAILURE,
            error: e,
        });
    }
}
function* watchDeleteDiary() {
    yield takeLatest(DELETE_DIARY_REQUEST, deleteDiary);
}

/*
    다이어리 수정하기
 */
function editDiaryAPI(editData) {
    return axios.patch(`/diary/editDiary`, editData, {
        withCredentials: true,
    });
}

function* editDiary(action) {
    try {
        const result = yield call(editDiaryAPI, action.data);
        yield put({
            type:EDIT_DIARY_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: EDIT_DIARY_FAILURE,
            error: e,
        });
    }
}
function* watchEditDiary() {
    yield takeLatest(EDIT_DIARY_REQUEST, editDiary);
}

/*
    해시태그 게시물들 가져오기
 */
function loadHashtagAPI(tag, lastId = 0, limit = 20) {
    return axios.get(`/diaries/hashtag/${encodeURIComponent(tag)}?lastId=${lastId}&limit=${limit}`, {
        withCredentials: true,
    });
}

function* loadHashtag(action) {
    try {
        const result = yield call(loadHashtagAPI, action.tag, action.lastId);
        yield put({
            type:LOAD_HASHTAG_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_HASHTAG_FAILURE,
            error: e,
        });
    }
}
function* watchLoadHashtag() {
    yield throttle(1000, LOAD_HASHTAG_REQUEST, loadHashtag);
}

/*
    좋아요 누르기
 */
function likeDiaryAPI(dairyId) {
    return axios.post(`/diary/like/${dairyId}`, {}, {
        withCredentials: true,
    });
}

function* likeDiary(action) {
    try {
        const result = yield call(likeDiaryAPI, action.data);
        yield put({
            type: LIKE_DIARY_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        yield put({
            type: LIKE_DIARY_FAILURE,
            error: e,
        });
    }
}
function* watchLikeDiary() {
    yield takeLatest(LIKE_DIARY_REQUEST, likeDiary);
}

/*
    좋아요 취소하기
 */
function unLikePostAPI(diaryId) {
    return axios.delete(`/diary/like/${diaryId}`, {
        withCredentials: true,
    });
}

function* unLikePost(action) {
    try {
        const result = yield call(unLikePostAPI, action.data);
        yield put({
            type: UNLIKE_DIARY_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        yield put({
            type: UNLIKE_DIARY_FAILURE,
            error: e,
        });
    }
}
function* watchUnLikeDiary() {
    yield takeLatest(UNLIKE_DIARY_REQUEST, unLikePost);
}

//시작점
export default function* postSaga() {
    yield all([
        fork(watchUploadImages),
        fork(watchAddPost),
        fork(watchLoadUserDiaries),
        fork(watchOnclickFavorite),
        fork(watchLoadFavorite),
        fork(watchLoadDiary),
        fork(watchLoadDiaries),
        fork(watchDeleteDiary),
        fork(watchEditDiary),
        fork(watchLoadHashtag),
        fork(watchLikeDiary),
        fork(watchUnLikeDiary),
    ]);
}