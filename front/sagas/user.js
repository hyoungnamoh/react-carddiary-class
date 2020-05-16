import {all, takeLatest, fork, put, call, take, takeEvery, delay, throttle} from 'redux-saga/effects';
import {
    LOG_IN_REQUEST,
    LOG_IN_SUCCESS,
    LOG_IN_FAILURE,
    SIGN_UP_REQUEST,
    SIGN_UP_SUCCESS,
    SIGN_UP_FAILURE,
    LOG_OUT_REQUEST,
    LOG_OUT_FAILURE,
    LOG_OUT_SUCCESS,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAILURE,
    EDIT_USER_REQUEST,
    EDIT_USER_SUCCESS,
    EDIT_USER_FAILURE,
    ADD_FOLLOW_REQUEST,
    ADD_FOLLOW_SUCCESS,
    ADD_FOLLOW_FAILURE,
    REMOVE_FOLLOW_REQUEST,
    REMOVE_FOLLOW_SUCCESS,
    REMOVE_FOLLOW_FAILURE,
    LOAD_FOLLOWINGLIST_REQUEST,
    LOAD_FOLLOWINGLIST_SUCCESS,
    LOAD_FOLLOWINGLIST_FAILURE,
    LOAD_FOLLOWERLIST_REQUEST,
    LOAD_FOLLOWERLIST_SUCCESS,
    LOAD_FOLLOWERLIST_FAILURE,
    LOAD_USERS_SUCCESS,
    LOAD_USERS_REQUEST,
    LOAD_USERS_FAILURE,
    ADD_TODO_REQUEST,
    ADD_TODO_FAILURE,
    ADD_TODO_SUCCESS,
    LOAD_TODO_REQUEST,
    LOAD_TODO_SUCCESS,
    LOAD_TODO_FAILURE,
    REMOVE_TODO_REQUEST,
    REMOVE_TODO_SUCCESS,
    REMOVE_TODO_FAILURE,
    SEARCH_EMAIL_FAILURE,
    SEARCH_EMAIL_REQUEST,
    SEARCH_EMAIL_SUCCESS,
    SEARCH_HASHTAG_REQUEST,
    SEARCH_HASHTAG_SUCCESS,
    SEARCH_HASHTAG_FAILURE, UPLOAD_PROFILE_SUCCESS, UPLOAD_PROFILE_FAILURE, UPLOAD_PROFILE_REQUEST, REQUEST_MAIN_LOG
} from "../reducers/user";
import axios from 'axios';
import {LOAD_DIARIES_REQUEST} from "../reducers/diary";



/*
    로그아웃
 */
function logOutAPI() {
    //서버에 요청을 보내는 부분
    return axios.post('/sign/logout', {}, {
        withCredentials: true,
    });
}

function* logOut(action) {
    try{
        const result = yield call(logOutAPI, action.data);//성공 시 다음 줄 실행
        yield put({
            type: LOG_OUT_SUCCESS, //실행
        })
    } catch (e) { //실패 시
        console.error(e);
        yield put({
            type: LOG_OUT_FAILURE
        })
    }
}

function* watchLogOut() {
    yield takeLatest(LOG_OUT_REQUEST, logOut);
}

/*
    유저 정보가져오기
 */
function loadUserAPI(userId) {
    // 서버에 요청을 보내는 부분
    return axios.get(userId ? `/user/userPage/${userId}` : '/user', {
        withCredentials: true,
    });
}
function* loadUser(action) {
    try {
        const result = yield call(loadUserAPI, action.data);
        yield put({ // put은 dispatch 동일
            type: LOAD_USER_SUCCESS,
            data: result.data,
            loginUser: !action.data, //action.data 로 회원 id 보내주는데 없으면 자기 자신이므로 true 가 되고 없으면 false 가 되어 reducer 에서 분기처리 됨
        });
    } catch (e) { // loginAPI 실패
        console.error(e);
        yield put({
            type: LOAD_USER_FAILURE,
            error: e,
        });
    }
}
function* watchLoadUser() {
    //(호출되길 기다리는 액션, 호출되면 실행할 함수)
    yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

/*
    회원가입
 */
function signUpAPI(signUpdata) {
    return axios.post('/sign/signUp', signUpdata);
}
function* signUp(action) {
    try{
        yield call(signUpAPI, action.data);// (함수, 인자)
        yield put({
            type: SIGN_UP_SUCCESS //실행
        })
    } catch (e) { //실패 시
        yield put({
            type: SIGN_UP_FAILURE,
            error: e
        })
    }
}
function* watchSignUp() {
    yield takeEvery(SIGN_UP_REQUEST, signUp);
}

/*
    로그인
 */
function loginAPI(loginData) {
    return axios.post('/sign/signIn', loginData, {
        withCredentials: true,
    });
}
function* login(action) {
    try{
       const result = yield call(loginAPI, action.data);
        yield put({
            type: LOG_IN_SUCCESS,
            data: result.data,
        })
    } catch (e) { //실패 시
        console.error(e);
        yield put({
            type: LOG_IN_FAILURE,
            reason: e.response && e.response.data,
        })
    }
}
function* watchLogin() {
    yield takeLatest(LOG_IN_REQUEST, login);
}

/*
    유저 정보 수정
 */
function editUserAPI(editData) {
    return axios.patch('/user/edit', editData, {
        withCredentials: true,
    });
}
function* editUser(action) {
    try{
        const result = yield call(editUserAPI, action.data);
        yield put({
            type: EDIT_USER_SUCCESS,
            data: result.data
        })
    } catch (e) {
        yield put({
            type: EDIT_USER_FAILURE,
            error: e
        })
    }
}
function* watchEditUser() {
    yield takeEvery(EDIT_USER_REQUEST, editUser);
}

/*
    프로필 이미지 업로드
 */
function uploadProfileAPI(formData) {
    return axios.post(`/user/profile`, formData, {
        withCredentials: true,
    });
}

function* uploadProfile(action) {
    try {
        const result = yield call(uploadProfileAPI, action.data);
        yield put({
            type: UPLOAD_PROFILE_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        yield put({
            type: UPLOAD_PROFILE_FAILURE,
            error: e,
        });
    }
}
function* wathUploadProfile() {
    yield takeLatest(UPLOAD_PROFILE_REQUEST, uploadProfile);
}

/*
   팔로우 하기
 */
function addFollowAPI(userId) {
    return axios.post(`/user/${userId}/follow`, {}, {
        withCredentials: true,
    });
}

function* addFollow(action) {
    try {
        const result = yield call(addFollowAPI, action.data);
        yield put({
            type: ADD_FOLLOW_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        yield put({
            type: ADD_FOLLOW_FAILURE,
            error: e,
        });
    }
}
function* watchAddFollow() {
    yield takeLatest(ADD_FOLLOW_REQUEST, addFollow);
}

/*
   팔로잉 목록 가져오기
 */
function loadFollowingListAPI() {
    return axios.get(`/user/followingList`,{
        withCredentials: true,
    });
}

function* loadFollowingList() {
    try {
        const result = yield call(loadFollowingListAPI);
        yield put({
            type: LOAD_FOLLOWINGLIST_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_FOLLOWINGLIST_FAILURE,
            error: e,
        });
    }
}
function* watchLoadFollowingList() {
    yield takeLatest(LOAD_FOLLOWINGLIST_REQUEST, loadFollowingList);
}

/*
   팔로워 목록 가져오기
 */
function loadFollowerListAPI() {
    return axios.get(`/user/followerList`,{
        withCredentials: true,
    });
}

function* loadFollowerList() {
    try {
        const result = yield call(loadFollowerListAPI);
        yield put({
            type: LOAD_FOLLOWERLIST_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_FOLLOWERLIST_FAILURE,
            error: e,
        });
    }
}
function* watchLoadFollowerList() {
    yield takeLatest(LOAD_FOLLOWERLIST_REQUEST, loadFollowerList);
}

/*
   팔로우 취소하기
 */
function removeFollowAPI(userId) {
    return axios.delete(`/user/${userId}/follow`,{
        withCredentials: true,
    });
}

function* removeFollow(action) {
    try {
        const result = yield call(removeFollowAPI, action.data);
        yield put({
            type: REMOVE_FOLLOW_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        yield put({
            type: REMOVE_FOLLOW_FAILURE,
            error: e,
        });
    }
}
function* watchRemoveFollow() {
    yield takeLatest(REMOVE_FOLLOW_REQUEST, removeFollow);
}

/*
   모든 유저 가져오기
 */
function loadUsersAPI() {
    return axios.get('/user/users',{
        withCredentials: true,
    });
}

function* loadUsers() {
    try {
        const result = yield call(loadUsersAPI);
        yield put({
            type: LOAD_USERS_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        yield put({
            type: LOAD_USERS_FAILURE,
            error: e,
        });
    }
}
function* watchLoadUsers() {
    yield takeLatest(LOAD_USERS_REQUEST, loadUsers);
}

/*
   투두리스트 추가하기
 */
function addTodoAPI(todoData) {
    return axios.post(`/user/todo`, todoData, {
        withCredentials: true,
    });
}

function* addTodo(action) {
    try {
        const result = yield call(addTodoAPI, action.data);
        yield put({
            type: ADD_TODO_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: ADD_TODO_FAILURE,
            error: e,
        });
    }
}
function* watchAddTodo() {
    yield takeLatest(ADD_TODO_REQUEST, addTodo);
}

/*
   투두리스트 가져오기
 */
function loadTodoAPI() {
    return axios.get(`/user/todo`, {
        withCredentials: true,
    });
}

function* loadTodo() {
    try {
        const result = yield call(loadTodoAPI);
        yield put({
            type: LOAD_TODO_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: LOAD_TODO_FAILURE,
            error: e,
        });
    }
}
function* watchLoadTodo() {
    yield takeLatest(LOAD_TODO_REQUEST, loadTodo);
}

/*
   투두리스트 삭제하기
 */
function removeTodoAPI(todoId) {
    return axios.delete(`/user/todo/${todoId}`, {
        withCredentials: true,
    });
}

function* removeTodo(action) {
    try {
        const result = yield call(removeTodoAPI, action.data);
        yield put({
            type: REMOVE_TODO_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: REMOVE_TODO_FAILURE,
            error: e,
        });
    }
}
function* watchRemoveTodo() {
    yield takeLatest(REMOVE_TODO_REQUEST, removeTodo);
}

/*
   이메일 검색하기
 */
function searchEmailAPI(searchKeyword) {
    return axios.get(`/user/emailSearch/${searchKeyword}`, {
        withCredentials: true,
    });
}

function* searchEmail(action) {
    try {
        const result = yield call(searchEmailAPI, action.data);
        yield put({
            type: SEARCH_EMAIL_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: SEARCH_EMAIL_FAILURE,
            error: e,
        });
    }
}
function* whatchSearchEmail() {
    yield takeLatest(SEARCH_EMAIL_REQUEST, searchEmail);
}

/*
   해시태그 검색하기
 */
function searchHashtagAPI(searchKeyword) {
    return axios.get(`/user/hashtagSearch/${encodeURIComponent(searchKeyword)}`, {
        withCredentials: true,
    });
}

function* searchHashtag(action) {
    try {
        const result = yield call(searchHashtagAPI, action.data);
        yield put({
            type: SEARCH_HASHTAG_SUCCESS,
            data: result.data,
        });
    }catch (e) {
        console.log(e);
        yield put({
            type: SEARCH_HASHTAG_FAILURE,
            error: e,
        });
    }
}
function* whatchSearchHashtag() {
    yield takeLatest(SEARCH_HASHTAG_REQUEST, searchHashtag);
}

/*
   메인 로그 찍기
 */
function mainLogAPI() {
    return axios.post(`/sign/log`, {}, {
        withCredentials: true,
    });
}

function* mainLog() {
    try {
        yield call(mainLogAPI);
    }catch (e) {
        console.log(e);
    }
}
function* watMainLog() {
    yield throttle(1000, REQUEST_MAIN_LOG, mainLog);
}

//시작점
export default function* userSaga() {
    //watch = 이벤트 리스너
    //all = 이벤트 리스너를 여러개 사용하고 싶을 때 사용, 여러 이펙트를 동시에 실행할 수 있게 함
    yield all ([
        fork(watchLogin),
        fork(watchSignUp),
        fork(watchLogOut),
        fork(watchLoadUser),
        fork(watchEditUser),
        fork(wathUploadProfile),
        fork(watchAddFollow),
        fork(watchLoadFollowingList),
        fork(watchLoadFollowerList),
        fork(watchRemoveFollow),
        fork(watchLoadUsers),
        fork(watchAddTodo),
        fork(watchLoadTodo),
        fork(watchRemoveTodo),
        fork(whatchSearchEmail),
        fork(whatchSearchHashtag),
        fork(watMainLog),
    ]);
}