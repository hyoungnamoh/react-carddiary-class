import {createMuiTheme, fade, makeStyles, withStyles} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import {yellow} from "@material-ui/core/colors";

const minWidth = 500;
//메인 스타일
export const UserPageSearchbarStyle = makeStyles(theme => ({
    root:{
        margin:"10%",
    },
    searchWrapper:{
        display:'flex',
        justifyContent:'flex-end',
    },
    search: {
        display:'flex',
        width:'300px',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.black, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.black, 0.25),
        },
        // marginLeft: '80%',
        marginTop: 0,
    },
    searchIcon: {
        padding: theme.spacing(2, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: 0,
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        paddingBottom:0,
        transition: theme.transitions.create('width'),
    },
    starIcon:{
        display:'flex',
        color: yellow[700],
    },
    cardWrapper:{
        marginTop:'3%',
    },
    [`@media (max-width: ${minWidth}px)`]: {
        userPaper:{
            marginTop:'10%',
        },
        cardWrapper:{
            marginTop:'10%',
        },
        search: {
            width:'90%',
        },
        searchWrapper:{
            justifyContent:'center',
        },
    },
}));
