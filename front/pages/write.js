import React, {useCallback, useEffect, useState} from "react";
import {Button, Grid, Input, InputBase, Paper,FormControlLabel, Radio, Checkbox} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from '@material-ui/core/styles';
import {DropzoneArea, DropzoneDialog} from 'material-ui-dropzone'
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import {ADD_DIARY_REQUEST, ADDED_DAIRY_SWITCHING, UPLOAD_IMAGES_REQUEST} from "../reducers/diary";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/router";
import CircularProgress from '@material-ui/core/CircularProgress';
import {blue, green} from '@material-ui/core/colors';
import {CHANGE_CURRENTPAGE_REQUEST} from "../reducers/user";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const minWidth = 790;
const useStyles = makeStyles((theme) => ({
    paperWrapper:{
        display:'flex',
        justifyContent:"center",
        width: '100vw',

    },
    writePaper:{
        display:'flex',
        width:'70%',
        justifyContent:"center",
        margin:'3%',
    },
    form: {
        display:'flex',
        width: '100%',
        flexDirection:'column',
        alignItems:'center',
    },
    formControl: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(5),
    },
    inputBaseMargin: {
        marginTop: theme.spacing(2),
    },
    buttonWrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    dropzone:{
        width:'70%',
        marginTop:'2%',

    },
    formControlWrapper:{
        width:'70%',
        display:'flex',
        justifyContent:'space-between',
        marginTop:'2%',
    },
    settingWrapper:{
        display:'flex',
        justifyContent:'flex-start',
    },
    textFieldWrapper:{
        width:'70%',
        display:'flex',
        flexDirection:'column',
    },
    [`@media (max-width: ${minWidth}px)`]: {
        writePaper:{
            width:'100%',
            justifyContent:"center",
            marginTop: '10%',
        },
        dropzone:{
            width:'90%',
            height:'80%',
        },
        formControlWrapper:{
            width:'90%',
            flexDirection:'column',
        },
        textFieldWrapper:{
            width:'90%',
            maxHeight:'300px',
        },
        settingWrapper:{
            flexDirection:'column',
        },
        buttonWrapper: {
            display:'flex',
            justifyContent:'flex-end',
        },
    },

}));


const WritePage = () => {
    const dispatch = useDispatch();
    const {imagePaths, cardDiaries, isDiaryAdding, diaryAdded} = useSelector(state => state.diary);
    const { loginUser, isLoggingOut, isLoggedIn} = useSelector(state => state.user);
    const router = useRouter();
    const classes = useStyles();
    const [files, setFiles] = useState([]); //드랍존 이미지 파일
    const [isPublic, setIsPublic] = useState("publicDiary"); //공개여부 라디오버튼
    const [diaryTitle, setDiaryTitle] = useState(''); //다이어리 제목
    const [diaryContent, setDiaryContent] = useState(''); //다이어리 내용
    const [isFavorite, setIsFavorite] = useState(false); //즐겨찾는 다이어리
    const isPhone = useMediaQuery('(max-width:834px)');

    //로그아웃 또는 로그인하지 않은 사용자 처리
    useEffect(() => {
        if(!loginUser || !isLoggedIn){
            router.push('/');
            return;
        }
        return;
    }, [loginUser, isLoggingOut]);

    /*
        드랍존 핸들링
    */
    const handleChange = (files) => {

        setFiles(files);
    }
    const onChangeImages = useCallback((files) => { //이미지 업로드
        setFiles(files);
        const imageFormData = new FormData();
        imageFormData.append('image', files);
        [].forEach.call(files, (f) => {
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
        if(!diaryTitle || !diaryTitle.trim()){
            return alert('제목을 작성하세요.');
        }
        if(!diaryContent || !diaryContent.trim()){
            return alert('내용을 작성하세요.');
        }
        if(files.length === 0){
            return alert('사진을 첨부해주세요.');
        }
        const formData = new FormData();
        imagePaths.forEach((i) => {
            formData.append('image', i);
        });
        formData.append('diaryTitle', diaryTitle);
        formData.append('diaryContent', diaryContent);
        formData.append('isPublic', isPublic);
        if(isFavorite){
            formData.append('isFavorite', "isFavorite");
        }
        dispatch({
            type: ADD_DIARY_REQUEST,
            data: formData,
        });
    }
    /*
        글 작성 완료 후 페이지 이동
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
        if(Array.isArray(fileName)){
            const addedMessage = fileName.map((v, i) =>{
                if (i === fileName.length -1){
                    return v;
                } else{
                    return v + ', '
                }
            });
            return `${addedMessage}가 추가되었습니다!`
        }else{
            return `${fileName}가 추가되었습니다!`
        }
    }
    const getFileLimitExceedMessage = (filesLimit) => {
        return `최대 ${filesLimit}장까지만 첨부할 수 있습니다.`
    }
    const getDropRejectMessage = (rejectedFile, acceptedFiles, maxFileSize) => {
        return `${acceptedFiles} 파일 형식만 첨부할 수 있습니다.`;
    }

    return(
        <div className={classes.paperWrapper}>
            <Paper variant="outlined" className={classes.writePaper}>
                <form  noValidate autoComplete="off" className={classes.form}  encType={"multipart/form-data"}>
                    <div className={classes.textFieldWrapper}>
                        <TextField required id="standard-required" label="제목" value={diaryTitle} onChange={onChangeDiaryTitle} style={{marginTop:'2%'}}/>
                        <TextField
                            id="outlined-multiline-static"
                            label="내용"
                            multiline
                            rows="20"
                            variant="outlined"
                            required={true}
                            value={diaryContent}
                            onChange={onChangeDiaryContent}
                            style={{marginTop:'2%'}}
                        />
                    </div>
                    <div className={classes.dropzone}>
                        <DropzoneArea
                            onChange={onChangeImages}
                            dropzoneText="이미지 추가하기"
                            filesLimit={10}
                            getFileRemovedMessage={getFileRemovedMessage}
                            getFileAddedMessage={getFileAddedMessage}
                            getFileLimitExceedMessage={getFileLimitExceedMessage}
                            getDropRejectMessage={getDropRejectMessage}
                            acceptedFiles={['image/*']}
                            maxFileSize={10000000}
                            useChipsForPreview={isPhone}
                        />
                    </div>
                    <div className={classes.formControlWrapper}>
                        <div className={classes.settingWrapper}>
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
                            <FormControl variant="outlined" className={classes.formControl}>
                                <h3>즐겨찾기 여부</h3>
                                <FormControlLabel
                                    checked={isFavorite}
                                    control={<Checkbox color="primary" />}
                                    label="즐겨찾기"
                                    labelPlacement="start"
                                    onChange={onChangeFavorite}
                                    labelPlacement="end"
                                />
                            </FormControl>
                            {/*즐겨찾기*/}

                        </div>
                        <div className={classes.buttonWrapper} >
                            <Button variant="outlined"
                                    className={classes.buttonClassname}
                                    disabled={isDiaryAdding}
                                    onClick={onSubmitForm} color="primary" >
                                작성하기
                            </Button>
                            {isDiaryAdding && <CircularProgress size={24} className={classes.buttonProgress} />}
                        </div>
                    </div>
                </form>
            </Paper>
        </div>

    )
}

WritePage.getInitialProps = (context) => {
    context.store.dispatch({
        type: CHANGE_CURRENTPAGE_REQUEST,
        data: 'Write Page',
    });
}

export default WritePage;