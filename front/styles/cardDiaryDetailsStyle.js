import {makeStyles} from "@material-ui/core/styles";
import {red, yellow} from "@material-ui/core/colors";
const minWidth = 1000;
export const cardDiaryDetailsStyle = makeStyles((theme) => ({
    root: {
        width: "70%",
        marginLeft: "15%",
        marginTop: "3%",
        marginBottom:"3%",
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
    starIcon:{
        color: yellow[700],
    },
    [`@media (max-width: ${minWidth}px)`]: {
        root:{
            marginTop:'15%',
        }
    },
}));