import React, {useCallback, useEffect, useState} from "react";
import {Button, Checkbox, FormControlLabel, Grid, Paper, Radio} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import {DropzoneArea} from 'material-ui-dropzone'
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import {ADDED_DAIRY_SWITCHING, EDIT_DIARY_REQUEST, LOAD_DIARY_REQUEST, UPLOAD_IMAGES_REQUEST} from "../reducers/diary";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import CircularProgress from '@material-ui/core/CircularProgress';
import {blue} from '@material-ui/core/colors';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ClearIcon from '@material-ui/icons/Clear';
import {CHANGE_CURRENTPAGE_REQUEST} from "../reducers/user";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import {editDiaryStyle} from "../styles/editDiaryStyles";



const editPage = () => {
    const dispatch = useDispatch();
    const {imagePaths, isDiaryAdding, diaryAdded, cardDiary} = useSelector(state => state.diary);
    const { loginUser, isLoggingOut, isLoggedIn} = useSelector(state => state.user);
    const router = useRouter();
    const classes = editDiaryStyle();
    const [files, setFiles] = useState([]); //드랍존 이미지 파일
    const [isPublic, setIsPublic] = useState(cardDiary.isPublic ? "publicDiary" : "privateDiary"); //공개여부 라디오버튼
    const [diaryTitle, setDiaryTitle] = useState(''); //다이어리 제목
    const [diaryContent, setDiaryContent] = useState(''); //다이어리 내용
    const [isFavorite, setIsFavorite] = useState(false); //즐겨찾기
    const [uploadedImage, setUploadedImage] = useState('');
    const isPhone = useMediaQuery('(max-width:834px)');

    //로그아웃 또는 로그인하지 않은 사용자 처리
    useEffect(() => {
        if(!loginUser || !isLoggedIn){
            router.push('/');
            return;
        }
        return;
    }, [loginUser, isLoggingOut]);

    useEffect(() => {
        setDiaryTitle(cardDiary.diaryTitle);
        setDiaryContent(cardDiary.diaryContent);
        cardDiary.isFavorite ? setIsFavorite(true) : setIsFavorite(false);
        // setIsFavorite(!!cardDiary.isFavorite);
        setUploadedImage(cardDiary.Images);
        cardDiary.isPublic ? setIsPublic("publicDiary") : setIsPublic("privateDiary");
    }, [cardDiary]);



    const onChangeImages = useCallback((file) => { //이미지 업로드
        setFiles(file);
        const imageFormData = new FormData();
        imageFormData.append('image', file);
        [].forEach.call(file, (f) => {
            imageFormData.append('image', f);
        });
        dispatch({
            type: UPLOAD_IMAGES_REQUEST,
            data: imageFormData,
        })
    }, [files]);

    /*
        폼 핸들링
    */
    const onChangeDiaryTitle = (e) => { //제목
        setDiaryTitle(e.target.value);
    }
    const onChangeDiaryContent = (e) => { //내용
        setDiaryContent(e.target.value);
    }
    const radioChange = (e) => { //공개여부
        setIsPublic(e.target.value);
    };
    const onChangeFavorite = (e) => { //즐겨찾기 체크
        setIsFavorite(e.target.checked);
    }
    const onSubmitForm = (e) => {
        e.preventDefault();
        const editFormdata = new FormData();
        if(!diaryTitle || !diaryTitle.trim()){
            return alert('제목을 작성하세요.');
        }
        if(!diaryContent || !diaryContent.trim()){
            return alert('내용을 작성하세요.');
        }
        if(files.length === 0 && uploadedImage.length === 0){
            return alert('사진을 첨부해주세요.');
        }
        imagePaths.forEach((i) => {
            editFormdata.append('image', i);
        });
        uploadedImage.forEach((i) => {
            editFormdata.append('image', i.src);
        });
        editFormdata.append('diaryTitle', diaryTitle);
        editFormdata.append('diaryContent', diaryContent);
        editFormdata.append('isPublic', isPublic);
        if(isFavorite){
            editFormdata.append('isFavorite', "isFavorite");
        }
        editFormdata.append('id', cardDiary.id);

        dispatch({
            type: EDIT_DIARY_REQUEST,
            data: editFormdata
        });
    }
    /*
        글 수정 완료 후 페이지 이동
    */
    useEffect(() => {
        if(diaryAdded){
            dispatch({
                type: ADDED_DAIRY_SWITCHING,
            });
            router.push('/');
        }

    }, [diaryAdded === true]);

    /*
        드랍존 출력 메세지 커스터마이징
    */
    const getFileRemovedMessage = (fileName) => {
        return `${fileName}가 삭제되었습니다!`
    }
    const getFileAddedMessage = (fileName) => {
        return `${fileName}가 추가되었습니다!`
    }
    const getFileLimitExceedMessage = (filesLimit) => {
        return `최대 ${filesLimit}장까지만 첨부할 수 있습니다.`
    }
    const getDropRejectMessage = (rejectedFile, acceptedFiles, maxFileSize) => {
        return `${acceptedFiles} 파일 형식만 첨부할 수 있습니다.`;
    }

    //업로드 완료된 이미지 지우기
    const onClickRemove = (index) => () => {
        const filteredImage = uploadedImage.filter((v, i) => i !== index);
        setUploadedImage(filteredImage);
    }
    return(

        <Paper variant="outlined" className={classes.papers}>
            <form  noValidate autoComplete="off" className={classes.root} style={{marginTop:"1%", marginBottom:"2%"}} encType="multipart/form-data">
                <Grid container>
                    <Grid item md={3}/>
                    <Grid item md={6}>
                        <TextField required id="standard-required" label="제목" value={diaryTitle} onChange={onChangeDiaryTitle}/>
                    </Grid>
                    <Grid item md={3}/>
                    <Grid item md={3}/>
                    <Grid item md={6}>
                        <TextField
                            id="outlined-multiline-static"
                            label="내용"
                            multiline
                            rows="20"
                            variant="outlined"
                            required={true}
                            value={diaryContent}
                            onChange={onChangeDiaryContent}
                        />
                    </Grid>
                    <Grid item md={3}/>
                </Grid>
                <Grid container>
                    <Grid item md={3}/>
                    <Grid item md={6} style={{marginLeft: 10}}>
                        <DropzoneArea
                            onChange={onChangeImages}
                            dropzoneText="이미지 추가하기"
                            filesLimit={10}
                            getFileRemovedMessage={getFileRemovedMessage}
                            getFileAddedMessage={getFileAddedMessage}
                            getFileLimitExceedMessage={getFileLimitExceedMessage}
                            getDropRejectMessage={getDropRejectMessage}
                            acceptedFiles={['image/*']}
                            useChipsForPreview={isPhone}
                            maxFileSize={10000000}
                        />
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader component="div" id="nested-list-subheader">
                                    업로드 완료된 목록
                                </ListSubheader>
                            }
                            className={classes.list}
                        >
                            { uploadedImage && uploadedImage.map((v,i) => (
                                    <ListItem key={v.src} style={{paddingBottom:0, paddingTop:0}}>
                                        <ListItemText  style={{margin:0, width:'100%'}}>{v.src}</ListItemText>
                                        <Button style={{padding:0}} onClick={onClickRemove(i)}><ClearIcon fontSize={"small"}/></Button>
                                    </ListItem>
                                ))}
                        </List>
                    </Grid>
                    <Grid  item md={2}/>
                    {/*옵션 시작*/}
                    <Grid container>
                        <Grid item md={3}/>
                        {/*<Grid item md={2}>*/}
                        {/*    <FormControl variant="outlined" className={classes.formControl}>*/}
                        {/*        <h3>저장위치</h3>*/}
                        {/*        <Select*/}
                        {/*            required={true}*/}
                        {/*            native*/}
                        {/*            style={{height:"30px", width:"100%", textAlign:"right", }}*/}
                        {/*        >*/}
                        {/*            <option aria-label="None" value="" />*/}
                        {/*            <option value={10}>추가할 예정입니다!</option>*/}
                        {/*        </Select>*/}
                        {/*    </FormControl>*/}
                        {/*</Grid>*/}
                        {/*공개 여부*/}
                        <Grid item md={3}>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <h3>공개여부</h3>
                                <RadioGroup row aria-label="position" name="position" defaultValue="top" value={isPublic} onChange={radioChange}>
                                    <FormControlLabel
                                        value="publicDiary"
                                        control={<Radio color="primary" />}
                                        label="공개"
                                        labelPlacement="end"
                                    />
                                    <FormControlLabel
                                        value="privateDiary"
                                        control={<Radio color="primary" />}
                                        label="비공개"
                                        labelPlacement="end"
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {/*즐겨찾기*/}
                        <Grid item md={2}>
                            <FormControlLabel
                                checked={isFavorite}
                                control={<Checkbox color="primary" />}
                                label="즐겨찾기"
                                labelPlacement="start"
                                style={{marginLeft:0, marginTop:2}}
                                onChange={onChangeFavorite}
                            />

                        </Grid>
                        <Grid item md={1}>
                            <div className={classes.wrapper} >
                                <Button variant="outlined"
                                        className={classes.buttonClassname}
                                        disabled={isDiaryAdding}
                                        onClick={onSubmitForm} color="primary" style={{marginTop:"70%"}}>
                                    저장하기
                                </Button>
                                {isDiaryAdding && <CircularProgress size={24} className={classes.buttonProgress} />}
                            </div>
                        </Grid>
                    </Grid>
                </Grid>

            </form>
        </Paper>


    )
}

editPage.getInitialProps = (context) => {
    const queryId = parseInt(context.query.id, 10);
    context.store.dispatch({
        type: CHANGE_CURRENTPAGE_REQUEST,
        data: 'Edit Page',
    });

    context.store.dispatch({
        type: LOAD_DIARY_REQUEST,
        data: queryId,
    });
    return { id: queryId };
}

export default editPage;