import {makeStyles} from "@material-ui/core/styles";
import {red, yellow} from "@material-ui/core/colors";

export const CardDiaryStyle = makeStyles(theme => ({
    root: {
        width: "330px",
        height: "430px",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    avatar: {
        backgroundColor: red[500],
    },
    starIcon:{
        color: yellow[700],
    },
    modal: {
        marginLeft: '35%',
        marginTop: '20%',
        maxWidth: '500px',
        maxHeight: '500px',
        width: '40%',
        height: '40%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));