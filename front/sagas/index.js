import {all, call, fork} from 'redux-saga/effects';
import user from './user';
import axios from "axios";
import diary from "./diary";
import {backUrl} from "../config/config";

axios.defaults.baseURL = `${backUrl}/api`;

export default function* rootSaga() {
    yield all([
        fork(user),
        fork(diary),
    ]);
}