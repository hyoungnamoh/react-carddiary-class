import {createMuiTheme, fade, makeStyles, withStyles} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";


//메인 스타일
export const MyInfoEditStyle = makeStyles(theme => ({
    textFieldWrapper: {
        width: '90%',
        zIndex: 1,
        top: 0,
        left: 0,
    },
    textFields:{
        width:'100%',
        marginTop:'10%',
    },
    avatar:{
        width: "85%",
        height: "85%",
        marginLeft:'5%',
    },
    diariesContainer: {
        marginTop:"5%",
        marginBottom:"5%",
    }
}));
