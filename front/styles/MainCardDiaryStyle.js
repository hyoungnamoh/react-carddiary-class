import {makeStyles} from "@material-ui/core/styles";
import {red, yellow} from "@material-ui/core/colors";

const minWidth = 1000;
export const mainCardDiaryStyle = makeStyles(theme => ({
    root: {
        width:'50vw',
        height: '100%',
        maxWidth: '800px',
        // maxHeight: '750px',
        marginBottom:"3%",
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
        marginLeft: '27%',
        marginTop: '15%',
        maxWidth: '750px',
        maxHeight: '750px',
        width: '60%',
        height: '60%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    [`@media (max-width: ${minWidth}px)`]: {
        root: {
            width:'80vw',
        },
    },
}));