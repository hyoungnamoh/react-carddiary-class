import {createMuiTheme, fade, makeStyles, withStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";

export const editDiaryStyle = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        marginLeft: theme.spacing(5),
    },
    selectEmpty: {
    },
    inputBaseMargin: {
        marginTop: theme.spacing(2),
    },
    buttonProgress: {
        color: blue[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: 20,
        marginLeft: -13,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    papers:{
        width: "75%",
        marginLeft: "12.5%"
    },
    buttonClassname:{
        padding:"9%"
    },
    list: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}));