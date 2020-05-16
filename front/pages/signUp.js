import React, {useCallback, useRef, useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {SIGN_UP_REQUEST} from "../reducers/user";
import Router from 'next/router';

const Copyright = () => {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

//style
const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

const SignUp = () => {
    //dispatch
    const dispatch = useDispatch();
    const {isSignedUp, me} = useSelector(state => state.user);
    
    //회원가입 성공 시
    if(isSignedUp){
        Router.push('/');
    }

    //style
    const classes = useStyles();

    //state
    const [userName, setUserName] = useState(''); //이름
    const [email, setEmail] = useState(''); //이메일
    const [password, setPassword] = useState(''); //비밀번호
    const [confirmPassword, setConfirmPassword] = useState(''); //비밀번호 확인
    const [userNameError, setUserNameError] = useState(''); //이름 에러문구
    const [emailError, setEmailError] = useState(''); //이메일 에러문구
    const [passwordError, setPasswordError] = useState(''); //비밀번호 에러문구
    const [confirmPasswordError, setConfirmPasswordError] = useState(''); //비밀번호 확인 에러문구
    const [isUserNameValid, setIsUserNameValid] = useState(true); //이름 유효성검사
    const [isEmailValid, setIsEmailValid] = useState(true); //이메일 유효성검사
    const [isPasswordValid, setIsPasswordValid] = useState(true); //비밀번호 유효성검사
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true); //비밀번호 일치여부

    //각 input Ref
    const userNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    //정규표현식
    const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
    const nameRegex = /^[가-힣]{1,4}$/;
    const passwordRegExp = /^[a-zA-z0-9]{8,20}$/;

    //이름 유효성검사
    const checkUserName = useCallback(() => {
        if(userName ===""){
            setUserNameError('');
            setIsUserNameValid(true);
            return;
        }
        if(!nameRegex.test(userName)){
            setIsUserNameValid(false);
            setUserNameError('이름을 확인해 주세요.');
            return;
        }
        setUserNameError('');
        setIsUserNameValid(true);
    }, [userName]);

    //이메일 유효성검사
    const checkEmail = useCallback(() => {
        if(email ===""){
            setEmailError('');
            setIsEmailValid(true);
            return;
        }
        if(!emailRegex.test(email)){
            setEmailError('이메일 형식이 올바르지 않습니다.');
            setIsEmailValid(false);
            return;
        }
        axios.post('/sign/emailCheck', {
            email,
        }).then((result) => {
            if(result.data){
                setEmailError('이미 사용중인 이메일입니다.');
                setIsEmailValid(false);
                return;
            }
        });
        setIsEmailValid(true);
        setEmailError('');
    },[email]);
    
    //비밀번호 유효성 검사
    const checkPassword = useCallback(() => {
        if(password ===""){
            setIsPasswordValid(true);
            setPasswordError('');
            return;
        }
        if(!passwordRegExp.test(password)){
            setIsPasswordValid(false);
            setPasswordError('영문 숫자 혼용하여 8~20자 입력해주세요.');
            return;
        }
        setIsPasswordValid(true);
        setPasswordError('');
        return;
    }, [password]);

    //비밀번호, 비밀번호 확인 일치 여부 확인
    const onChangeConfirmPassword = useCallback((e) => {
        setConfirmPassword(e.target.value);
        if(e.target.value !== password){
            setIsConfirmPasswordValid(false);
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
            return;
        }
        setIsConfirmPasswordValid(true);
        setConfirmPasswordError('');
    }, [confirmPassword]);
    
    //회원가입 버튼 클릭
    const onSubmitForm = useCallback((e) => {
        e.preventDefault();
        
        //공백 체크
        if(userName === ""){
            alert('이름을 입력해주세요.');
            userNameRef.current.focus();
            return;
        }
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
        if(confirmPassword === ""){
            alert('비밀번호를 입력해주세요.');
            confirmPasswordRef.current.focus();
            return;
        }
        //유효성 검사
        if(!isUserNameValid || !isPasswordValid || !isEmailValid || !isConfirmPasswordValid){
            return;
        }
        dispatch({
            type: SIGN_UP_REQUEST,
            data: {
                userName,
                email,
                password,
            }
        });
    }, [userName, email, password, confirmPassword]);

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}  >
                            <TextField
                                inputRef={userNameRef}
                                type="text"
                                variant="outlined"
                                required
                                fullWidth
                                id="userName"
                                label="Name"
                                name="userName"
                                autoComplete="lname"
                                value={userName}
                                onChange={(e) => {setUserName(e.target.value)}}
                                error={!isUserNameValid}
                                onBlur={checkUserName}
                                helperText={userNameError}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={emailRef}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                error={!isEmailValid}
                                value={email}
                                onChange={(e) => {setEmail(e.target.value)}}
                                onBlur={checkEmail}
                                helperText={emailError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={passwordRef}
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={!isPasswordValid}
                                onBlur={checkPassword}
                                onChange={(e) => {setPassword(e.target.value)}}
                                value={password}
                                helperText={passwordError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                inputRef={confirmPasswordRef}
                                variant="outlined"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="confirmPassword"
                                autoComplete="current-password"
                                error={!isConfirmPasswordValid}
                                onChange={onChangeConfirmPassword}
                                value={confirmPassword}
                                helperText={confirmPasswordError}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onSubmitForm}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}

export default SignUp;