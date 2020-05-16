//유저 정보 store
import produce from "immer";

export const initialState = { //초기값
    isLoggingOut: false, //로그아웃 시도중
    isLoggingIn: false, //로그인 시도중
    logInErrorReason: '', //로그인 실패 사유
    isLoggedIn: true,
    isSignedUp: false, //회원가입 성공
    isSigningUp: false, //회원가입 시도중
    signUpErrorReason: '', //회원가입 실패 사유
    loginUser: null, //로그인한 유저
    personalUser: null, //로그인한 유저가 아닌 다른 유저정보
    isEditing: false, //수정중 상태
    profileImagePath: '', //프로필 이미지 미리보기 경로
    followingList: [],
    followerList: [],
    currentPage:'', //현재 페이지
    defaultPage: ['User Page', 'Main Page', 'Write Page'],
    users:[], //모든 유저
    todoList:[], //모든 유저
    isSearching: false, //검색중
    searchResult: {}, //검색결과
    searchError: '', //검색에러
    isOpenedDraw: false, //팔로우리스트 열고 닫기
};

//로그인하는 액션
export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

//로그아웃하는 액션
export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

//회원가입하는 액션
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST'; 
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

//사용자 정보 불러오는 액션
export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

//사용자 정보 변경 액션
export const EDIT_USER_REQUEST = 'EDIT_USER_REQUEST';
export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';
export const EDIT_USER_FAILURE = 'EDIT_USER_FAILURE';

//팔로워 추가하는 액션
export const ADD_FOLLOW_REQUEST = 'ADD_FOLLOW_REQUEST';
export const ADD_FOLLOW_SUCCESS = 'ADD_FOLLOW_SUCCESS';
export const ADD_FOLLOW_FAILURE = 'ADD_FOLLOW_FAILURE';

//팔로잉 목록 가져오는 액션
export const LOAD_FOLLOWINGLIST_REQUEST = 'LOAD_FOLLOWINGLIST_REQUEST';
export const LOAD_FOLLOWINGLIST_SUCCESS = 'LOAD_FOLLOWINGLIST_SUCCESS';
export const LOAD_FOLLOWINGLIST_FAILURE = 'LOAD_FOLLOWINGLIST_FAILURE';

//팔로잉 목록 가져오는 액션
export const LOAD_FOLLOWERLIST_REQUEST = 'LOAD_FOLLOWERLIST_REQUEST';
export const LOAD_FOLLOWERLIST_SUCCESS = 'LOAD_FOLLOWERLIST_SUCCESS';
export const LOAD_FOLLOWERLIST_FAILURE = 'LOAD_FOLLOWERLIST_FAILURE';


//팔로잉 취소하는 액션
export const REMOVE_FOLLOW_REQUEST = 'REMOVE_FOLLOW_REQUEST';
export const REMOVE_FOLLOW_SUCCESS = 'REMOVE_FOLLOW_SUCCESS';
export const REMOVE_FOLLOW_FAILURE = 'REMOVE_FOLLOW_FAILURE';

//사용자 수정 중 상태 액션
export const USER_EDITFORM_REQUEST = 'USER_EDITFORM_REQUEST';

//페이지 바꾸는 액션
export const CHANGE_CURRENTPAGE_REQUEST = 'CHANGE_CURRENTPAGE_REQUEST';

//모든 유저 가져오는 액션
export const LOAD_USERS_REQUEST = 'LOAD_USERS_REQUEST';
export const LOAD_USERS_SUCCESS = 'LOAD_USERS_SUCCESS';
export const LOAD_USERS_FAILURE = 'LOAD_USERS_FAILURE';

//투두리스트 추가하는 액션
export const ADD_TODO_REQUEST = 'ADD_TODO_REQUEST';
export const ADD_TODO_SUCCESS = 'ADD_TODO_SUCCESS';
export const ADD_TODO_FAILURE = 'ADD_TODO_FAILURE';

//투두리스트 불러오는 액션
export const LOAD_TODO_REQUEST = 'LOAD_TODO_REQUEST';
export const LOAD_TODO_SUCCESS = 'LOAD_TODO_SUCCESS';
export const LOAD_TODO_FAILURE = 'LOAD_TODO_FAILURE';

//투두리스트 지우는 액션
export const REMOVE_TODO_REQUEST = 'REMOVE_TODO_REQUEST';
export const REMOVE_TODO_SUCCESS = 'REMOVE_TODO_SUCCESS';
export const REMOVE_TODO_FAILURE = 'REMOVE_TODO_FAILURE';

//이메일 조회하는 액션
export const SEARCH_EMAIL_REQUEST = 'SEARCH_EMAIL_REQUEST';
export const SEARCH_EMAIL_SUCCESS = 'SEARCH_EMAIL_SUCCESS';
export const SEARCH_EMAIL_FAILURE = 'SEARCH_EMAIL_FAILURE';

//해시태그 조회하는 액션
export const SEARCH_HASHTAG_REQUEST = 'SEARCH_HASHTAG_REQUEST';
export const SEARCH_HASHTAG_SUCCESS = 'SEARCH_HASHTAG_SUCCESS';
export const SEARCH_HASHTAG_FAILURE = 'SEARCH_HASHTAG_FAILURE';


//프로필 이미지 업로드하는 액션
export const UPLOAD_PROFILE_REQUEST = 'UPLOAD_PROFILE_REQUEST';
export const UPLOAD_PROFILE_SUCCESS = 'UPLOAD_PROFILE_SUCCESS';
export const UPLOAD_PROFILE_FAILURE = 'UPLOAD_PROFILE_FAILURE';

//Log
export const REQUEST_MAIN_LOG = 'REQUEST_MAIN_LOG';

//팔로워 팔로잉 목록창 제어 액션
export const REQUEST_SWITCHING_DRAW = 'REQUEST_SWITCHING_DRAW';
export const SUCCESS_SWITCHING_DRAW = 'SUCCESS_SWITCHING_DRAW';
export const FAILURE_SWITCHING_DRAW = 'FAILURE_SWITCHING_DRAW';


//setState
const reducer = (state = initialState, action) => {
    return produce(state, (draft) => {
        switch (action.type) {
            case LOG_IN_REQUEST : {
                draft.isLoggingIn= true;
                draft.logInErrorReason = null;
                draft.isLoading = true;
                break;
            }
            case LOG_IN_SUCCESS: {
                draft.isLoggingIn = false;
                draft.loginUser = action.data;
                draft.isLoading = false;
                break;
            }

            case LOG_IN_FAILURE : {
                draft.logInErrorReason = action.reason;
                draft.isLoggingIn = false;
                draft.isLoading = false;
                break;
            }
            case SIGN_UP_REQUEST : {
                draft.isSigningUp = true;
                draft.signUpErrorReason = '';
                break;
            }
            case SIGN_UP_SUCCESS : {
                draft.isSigningUp = false;
                draft.isSignedUp = true;
                break;
            }
            case SIGN_UP_FAILURE : {
                draft.isSigningUp = false;
                draft.signUpErrorReason = action.error;
                break;
            }
            case LOG_OUT_REQUEST : {
                draft.isLoggingOut = true;
                draft.logInErrorReason = '';
                draft.isLoggingIn = false;
                break;
            }
            case LOG_OUT_SUCCESS : {
                draft.isLoggingOut= false;
                draft.loginUser= null;
                break;
            }
            case LOG_OUT_FAILURE : {
                draft.isLoggingOut= false;
                break;
            }
            case LOAD_USER_REQUEST : {
                draft.personalUser = null;
                break;
            }
            case LOAD_USER_SUCCESS : {
                if (action.loginUser) {
                    draft.loginUser = action.data;
                    draft.personalUser = action.data;
                    break;
                }
                draft.personalUser = action.data;
                break;
            }
            case LOAD_USER_FAILURE : {
                draft.isSigningUp= false;
                break;
            }
            case EDIT_USER_REQUEST : {
                break;
            }
            case EDIT_USER_SUCCESS : {
                draft.profileImagePath = null;
                draft.loginUser = action.data;
                draft.personalUser = action.data;
                break;
            }
            case EDIT_USER_FAILURE : {
                console.log(action.error);
                break;
            }
            case USER_EDITFORM_REQUEST: {
                draft.isEditing = !draft.isEditing;
                break;
            }
            case UPLOAD_PROFILE_REQUEST: {
                break;
            }
            case UPLOAD_PROFILE_SUCCESS: {
                draft.profileImagePath = action.data;
                break;
            }
            case UPLOAD_PROFILE_FAILURE: {
                break;
            }
            case ADD_FOLLOW_REQUEST: {
                break;
            }
            case ADD_FOLLOW_SUCCESS: {
                draft.followingList = [];
                action.data.forEach((d) => {
                    draft.followingList.push(d);
                });
                break;
            }
            case ADD_FOLLOW_FAILURE: {
                break;
            }
            case LOAD_FOLLOWINGLIST_REQUEST: {
                break;
            }
            case LOAD_FOLLOWINGLIST_SUCCESS: {
                draft.followingList = [];
                action.data.forEach((d) => {
                    draft.followingList.push(d);
                });
                break;
            }
            case LOAD_FOLLOWINGLIST_FAILURE: {
                break;
            }
            case LOAD_FOLLOWERLIST_REQUEST: {
                break;
            }
            case LOAD_FOLLOWERLIST_SUCCESS: {
                draft.followerList = [];
                action.data.forEach((d) => {
                    draft.followerList.push(d);
                });
                break;
            }
            case LOAD_FOLLOWERLIST_FAILURE: {
                break;
            }
            case REMOVE_FOLLOW_REQUEST: {
                break;
            }
            case REMOVE_FOLLOW_SUCCESS: {
                const index = draft.followingList.findIndex(v => v.id === action.data);
                draft.followingList.splice(index, 1);
                break;
            }
            case REMOVE_FOLLOW_FAILURE: {
                break;
            }
            case CHANGE_CURRENTPAGE_REQUEST: {
                draft.currentPage = action.data;
                break;
            }
            case LOAD_USERS_REQUEST: {
                break;
            }
            case LOAD_USERS_SUCCESS: {
                draft.users = action.data;
                break;
            }
            case LOAD_USERS_FAILURE: {
                break;
            }
            case ADD_TODO_REQUEST: {
                break;
            }
            case ADD_TODO_SUCCESS: {
                draft.todoList.unshift(action.data);
                // draft.todoList = [];
                // action.data.forEach((d) => {
                //     draft.followingList.push(d);
                // });
                break;
            }
            case ADD_TODO_FAILURE: {
                break;
            }
            case LOAD_TODO_REQUEST: {
                break;
            }
            case LOAD_TODO_SUCCESS: {
                draft.todoList = [];
                action.data.forEach((todo) => {
                    draft.todoList.push(todo);
                });
                break;
            }
            case LOAD_TODO_FAILURE: {
                break;
            }
            case REMOVE_TODO_REQUEST: {
                break;
            }
            case REMOVE_TODO_SUCCESS: {
                const index = draft.todoList.findIndex(v => v.id === action.data);
                draft.todoList.splice(index, 1);
                break;
            }
            case REMOVE_TODO_FAILURE: {
                break;
            }
            case SEARCH_EMAIL_REQUEST: {
                break;
            }
            case SEARCH_EMAIL_SUCCESS: {
                draft.searchResult = action.data;
                draft.searchError='';
                break;
            }
            case SEARCH_EMAIL_FAILURE: {
                draft.searchError=action.error;
                break;
            }
            case SEARCH_HASHTAG_REQUEST: {
                break;
            }
            case SEARCH_HASHTAG_SUCCESS: {
                draft.searchResult = action.data;
                draft.searchError='';
                break;
            }
            case SEARCH_HASHTAG_FAILURE: {
                draft.searchError=action.error;
                break;
            }
            case REQUEST_MAIN_LOG: {
                break;
            }
            case REQUEST_SWITCHING_DRAW: {
                if(action.data){
                    draft.isOpenedDraw = false;
                    break;
                }
                draft.isOpenedDraw = !draft.isOpenedDraw;
                break;
            }
            case SUCCESS_SWITCHING_DRAW: {
                break;
            }
            case FAILURE_SWITCHING_DRAW: {
                break;
            }

            default : {
              break;
            }
        }
    });
};
//reducer와 initialState는 자주 쓰이므로 export 함
export default reducer;