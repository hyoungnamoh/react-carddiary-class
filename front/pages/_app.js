import '@babel/polyfill';
import React, {useEffect} from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import {Provider} from 'react-redux';
import AppLayout from '../components/AppLayout';
import axios from "axios";
import reducer from "../reducers";
import withRedux from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import {applyMiddleware, compose, createStore} from 'redux';
import rootSaga from '../sagas';
import {LOAD_USER_REQUEST} from "../reducers/user";
import withReduxSaga from "next-redux-saga";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const CardDiary = ({Component, store, pageProps}) => {

    useEffect(() => {
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }, []);
    return (
        <Provider store={store}>
            <Head>
                <title>CardDiary</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"/>
            </Head>
            <AppLayout {...pageProps}>
                <Component {...pageProps}/>
            </AppLayout>
        </Provider>
    );
};

CardDiary.propTypes = {
    Component: PropTypes.elementType,
};

CardDiary.getInitialProps = async (context) => {
    const { ctx } = context;
    let pageProps = {};
    const state = ctx.store.getState();
    const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
    if(ctx.isServer && cookie){
        axios.defaults.headers.Cookie = cookie;
    }
    //user 정보 가져오기
    if(!state.user.loginUser){
        ctx.store.dispatch({
            type: LOAD_USER_REQUEST,
            data: 0,
        });
    }
    if(context.Component.getInitialProps){
        pageProps = await context.Component.getInitialProps(ctx) || {};
    }

    return {pageProps};
}

const configureStore = (initialState, options) => {
    //사가 미들웨어 생성
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [sagaMiddleware, (store) => (next) => (action) => {
        next(action);
    }];

    //redux의 기능을 향상시킴
    const enhancer = process.env.NODE_ENV === 'production' //실제 서비스면
        ? compose(applyMiddleware(...middlewares),)
        : compose(applyMiddleware(...middlewares),
            !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
        );

    const store = createStore(reducer, initialState, enhancer); //

    //미들웨어에 root사가 연결
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
}
export default withRedux(configureStore)(withReduxSaga(CardDiary));