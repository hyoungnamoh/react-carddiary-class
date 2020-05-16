import React, {useCallback, useEffect, useRef, useState} from 'react';
/*
    material - ui
 */
import clsx from 'clsx';
import {createMuiTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputBase from '@material-ui/core/InputBase';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {useDispatch, useSelector} from "react-redux";
import {
    CHANGE_CURRENTPAGE_REQUEST,
    LOG_OUT_REQUEST,
    REQUEST_SWITCHING_DRAW,
    SEARCH_EMAIL_REQUEST,
    SEARCH_HASHTAG_REQUEST
} from "../reducers/user";
import {useRouter} from "next/router";
import {Button} from "@material-ui/core";
import {AppLayoutStyle, BootstrapInput} from "../styles/AppLayoutStyle"

/*
    material - ui
 */

//AppBar 색 변경
const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#bbdefb',
        },
        secondary: {
            main: '#f8bbd0',
        },
    },
});

const AppLayout = ({ children }) => {
    const classes = AppLayoutStyle();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const {currentPage, defaultPage, isSearching, searchResult, searchError,isOpenedDraw} = useSelector(state => state.user);
    const [pageName, setPageName] = useState('');
    const [value, setValue] = useState(0);
    const [tabMargin, setTabMargin] = useState(['25%', '-25%']); //로고 마진
    const [searchMargin, setSearchMargin] = useState(['15%', '-15%']); //검색바 마진
    const [searchText, setSearchText] = useState('');
    const searchRef = useRef('');
    const [searchOption, setSearchOption] = useState('none');
    const mounted = useRef(false);
    const isPhone = useMediaQuery('(max-width:834px)');
    //사용자가 어느 페이지에서 접속할지 모르기 때문에 공통 레이아웃으로 뺌
    const {loginUser, isLoggingOut} = useSelector(state => state.user);
    const router = useRouter();
    useEffect(() => {
        if(defaultPage.includes(currentPage)){
            setPageName('');
        }
        if(currentPage){
            if(currentPage === 'Main Page'){
                setTabMargin(['10%', '-10%']);
                setSearchMargin(['15%', '-15%']);
                setValue(0);
            } else if(currentPage === 'Write Page'){
                setTabMargin(['10%', '-10%']);
                setSearchMargin(['15%', '-15%']);
                setValue(1);
            } else if(currentPage === 'User Page'){
                setTabMargin(['10%', '-10%']);
                setSearchMargin(['15%', '-15%']);
                setValue(2);
            } else{
                setTabMargin(['6%', '-6%']);
                setSearchMargin(['5%', '-5%']);
                setValue(3);
                setPageName(currentPage);
            }
        }

    }, [currentPage]);

    //로그아웃 버튼
    const onLogOut = useCallback(() => {
        dispatch({
            type:LOG_OUT_REQUEST,
        });
    }, [loginUser]);

    //작성페이지 이동
    const onClickWritePage = () => {
        dispatch({
            type: CHANGE_CURRENTPAGE_REQUEST,
            data: '',
        });
        router.push("/write");
    }
    //글목록 이동
    const onClickUserPage = () => {
        dispatch({
            type: CHANGE_CURRENTPAGE_REQUEST,
            data: '',
        });
        router.push(`/user`);
    }

    //로고, 메인화면 이동
    const onClickMainPage = () => {
        dispatch({
            type: CHANGE_CURRENTPAGE_REQUEST,
            data: '',
        });
        router.push("/main");
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    //서치바 핸들링
    const onChangeSearchText = useCallback((e) => {
        setSearchText(e.target.value);
    },[searchText,  searchResult]);
    const onClickSearch = useCallback( () => {
        if(searchOption === 'email' && !searchText){
            return alert('이메일을 입력해주세요.');
        } else if(searchOption === 'hashtag' && !searchText){
            return alert('해시태그를 입력해주세요.');
        } else if(searchOption === 'none'){
            return alert('옵션을 선택해 주세요.');
        }
        if(searchOption === 'email'){
            dispatch({
                type: SEARCH_EMAIL_REQUEST,
                data: searchText,
            });
        } else if(searchOption === 'hashtag'){
            dispatch({
                type: SEARCH_HASHTAG_REQUEST,
                data: searchText,
            });
        }
    }, [searchText, searchOption, searchResult]);

    useEffect(() => {
        if(!mounted.current){
            mounted.current = true;
            return;
        } else{
            if(searchError && !searchResult.id){
                return alert('검색 결과가 없습니다.');
            } else{
                if(searchOption === 'email'){
                    return router.push(`/user/${searchResult.id}`);
                } else{
                    return router.push(`/diary/hashtag/${searchResult.name}`);
                }
            }
        }
    }, [searchResult, searchError]);

    const handleDrawerOpen = () => {
        dispatch({
            type: REQUEST_SWITCHING_DRAW,
        });
    };

    const handleChangeSelect = (e) => {
        setSearchOption(e.target.value);
    };

    useEffect(() => {
        dispatch({
            type: REQUEST_SWITCHING_DRAW,
            data: true,
        });
    }, [isPhone]);
    return (
        <>
            {loginUser ?
                <div className={classes.root}>
                    <CssBaseline />
                        <AppBar
                            position="fixed"
                            className={clsx(classes.appBar, {
                                [classes.appBarShift]: open,
                            })}
                            color="default"
                            style={{display:'flex', }}
                        >
                            <div >
                                <Toolbar className={classes.toolbarWrapper}>
                                    <div className={classes.logo}>
                                        <IconButton variant="h6" onClick={onClickMainPage} className={classes.logoButton} >
                                            Card Diary
                                            {/*<img src='http://localhost:3642/logo.png' alt='CardDiary' style={{width:100, height:80}}/>*/}
                                        </IconButton>
                                    </div>
                                    <div className={classes.tabs}>
                                        <Tabs value={value} onChange={handleChange} aria-label="Menu" style={{display:'flex', justifyContent:'spaceBetween'}}>
                                            <Tab label="Main" onClick={onClickMainPage} className={classes.tab} />
                                            <Tab label="Write" onClick={onClickWritePage} className={classes.tab}/>
                                            <Tab label="User" onClick={onClickUserPage} className={classes.tab}/>
                                            {pageName && <Tab label={pageName} className={classes.tab}/>}
                                            <Tab label="Log Out" onClick={onLogOut} className={classes.tab}/>
                                        </Tabs>
                                        {/*햄버거버튼*/}
                                        <div className={clsx((!isPhone || isOpenedDraw) && classes.hide)}>
                                            <IconButton
                                                color="inherit"
                                                aria-label="open drawer"
                                                edge="end"
                                                onClick={handleDrawerOpen}
                                            >
                                                <MenuIcon />
                                            </IconButton>
                                        </div>
                                    </div>
                                    <div className={classes.formControllerWrapper}>
                                        <FormControl>
                                            <NativeSelect
                                                id="demo-customized-select-native"
                                                value={searchOption}
                                                onChange={handleChangeSelect}
                                                input={<BootstrapInput />}
                                            >
                                                <option value={'none'}>선택</option>
                                                <option value={'email'}>이메일</option>
                                                <option value={'hashtag'}>해시태그</option>
                                            </NativeSelect>
                                        </FormControl>
                                        <div className={classes.search} >
                                            <div className={classes.searchIcon}>
                                                <SearchIcon />
                                            </div>
                                            <InputBase
                                                placeholder="Search…"
                                                classes={{
                                                    root: classes.inputRoot,
                                                    input: classes.inputInput,
                                                }}
                                                inputProps={{ 'aria-label': 'search' }}
                                                value={searchText}
                                                onChange={onChangeSearchText}
                                                ref={searchRef}
                                            />
                                            <Button onClick={onClickSearch}>검색</Button>
                                        </div>
                                    </div>
                                </Toolbar>
                            </div>
                        </AppBar>
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                            {children}
                        </main>
                </div>
            :
                <div>
                  {children}
                </div>
           }
        </>
    );
};

export default AppLayout;