import React, {useCallback, useState} from "react";
import SearchIcon from "@material-ui/icons/Search";
import {InputBase} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import StarRoundedIcon from "@material-ui/icons/StarRounded";
import StarBorderRoundedIcon from "@material-ui/icons/StarBorderRounded";
import {useSelector} from "react-redux";
import CardDiary from "./CardDiary";
import {UserPageSearchbarStyle} from "../styles/UserPageSearchbarStyle";


const UserPageSearchbar = () => {
    const classes = UserPageSearchbarStyle();
    const {loginUserCardDiaries} = useSelector(state => state.diary);
    const [searchKeyword, setSearchKeyword] = useState('');

    //즐겨찾기한 글만 보기
    const [onFilteredSearching, setOnFilteredSearching] = useState(false);
    const onClickFavoriteSearch = () => {
        setOnFilteredSearching(!onFilteredSearching);
    };
    //검색 기능
    const onChangeSearchKeyword = (e) => {
        setSearchKeyword(e.target.value);
    }
    const filteredDiaries = useCallback(loginUserCardDiaries.filter((v) => { //data 를 받아 객체안에 name이라는 속성에 searchKeyword가 있으면
        if(onFilteredSearching){
            return v.isFavorite && (v.diaryTitle.indexOf(searchKeyword) > -1 || v.diaryContent.indexOf(searchKeyword) > -1); //즐겨찾기만 보기
        }
        return v.diaryTitle.indexOf(searchKeyword) > -1 || v.diaryContent.indexOf(searchKeyword) > -1; //모든 글에서 보기
    }), [onFilteredSearching, loginUserCardDiaries, searchKeyword,]);
    return (
        <>
            <div style={{}}>
                <div className={classes.searchWrapper}>
                    <div className={classes.search}>
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
                            value={searchKeyword ? searchKeyword : ''}
                            onChange={onChangeSearchKeyword}
                        />
                        <IconButton aria-label="share" onClick={onClickFavoriteSearch}>
                            {
                                onFilteredSearching
                                    ? <StarRoundedIcon fontSize="large" color="inherit" className={classes.starIcon}/>
                                    : <StarBorderRoundedIcon fontSize="large" color="inherit"
                                                             className={classes.starIcon}/>

                            }
                        </IconButton>
                    </div>
                </div>
            </div>
            <div style={{display:'flex', flexWrap:'wrap', justifyContent:'space-around', }}>
                {
                    filteredDiaries.map(v => {
                        return (
                            <div className={classes.cardWrapper}>
                                <CardDiary key={v.id} diary={v}/>
                            </div>
                    )})
                }
            </div>
        </>
    );
};

export default UserPageSearchbar;