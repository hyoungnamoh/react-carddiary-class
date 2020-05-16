import React, {useCallback, useEffect, useRef, useState} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Link from "next/link";
import Box from "@material-ui/core/Box";
import {LOAD_USER_REQUEST, LOG_IN_REQUEST, REQUEST_MAIN_LOG} from "../reducers/user";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import {indexStyle} from "../styles/indexStyles";

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            Card Diary
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const Index = () => {
    const dispatch = useDispatch();
    const {logInErrorReason, isLoggingIn, loginUser} = useSelector(state => state.user);
    const router = useRouter();
    const classes = indexStyle();
    const [email, setEmail] = useState('carddiary@naver.com');
    const [password, setPassword] = useState('carddiary');
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    
    //로그인 성공 시 메인페이지로
    useEffect(() => {
        if(loginUser){
            router.push('/main');
        }
    }, [loginUser])
    //로그인 실패시 에러 표시
    useEffect(() => {
        if(logInErrorReason){
            alert(logInErrorReason);
        }
    }, [isLoggingIn, logInErrorReason,]);

    //폼 핸들링
    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }
    //로그인 버튼
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        //공백체크
        if(email === ""){
            alert('이메일을 입력해주세요.');
            emailRef.current.focus();
            return;
        }
        if(password === ""){
            alert('비밀번호를 입력해주세요.');
            passwordRef.current.focus();
            return;
        }
        dispatch({
            type: LOG_IN_REQUEST,
            data: {
                email: email,
                password: password,
            },
        });
    },[email, password]);

    const onPressEnter = (e) => {
        if (e.key === 'Enter') {
            onSubmitForm(e);
        }
    };

    //Log
    dispatch({
        type: REQUEST_MAIN_LOG,
    })

    return(
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={onChangeEmail}
                            inputRef={emailRef}
                            onKeyPress={onPressEnter}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={onChangePassword}
                            inputRef={passwordRef}
                            onKeyPress={onPressEnter}
                        />
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={onSubmitForm}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                            </Grid>
                            <Grid item>
                                <Link href="/signUp" ><a><Button>Don't have an account? Sign Up</Button></a></Link>
                            </Grid>
                        </Grid>
                        <Box mt={5}>
                            <Copyright />
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    )
}
Index.getInitialProps = (context) => {
    let userId = 0;
    const queryId = context.query.userId && parseInt(context.query.userId, 10);
    if(queryId){
        userId = queryId;
    }
    context.store.dispatch({
        type: LOAD_USER_REQUEST,
        data: userId,
    });
}
export default Index;