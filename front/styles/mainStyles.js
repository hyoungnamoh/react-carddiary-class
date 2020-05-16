import {createMuiTheme, fade, makeStyles, withStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";

const minWidth = 1000;
export const mainStyle = makeStyles((theme) => ({
    mainContainer: {
        display: 'flex',
    },
    mainCardDiaryWrapper: {
        display:'flex',
        flexDirection:'column',
        alignItems:'center',
        width:'50vw',
        marginTop: '3%',
        marginLeft:'4%',
        marginRight:'3%'
    },
    todoListWrapper:{
        display:'flex', width:'25vw',
        position: 'sticky',
        top: '12%',
        left:'1%',
        height: '800px',
    },

    typography: {
        width:'100%',
        marginTop:'3%',
    },
    followerDrawWrapperWeb:{
        display:'flex',
        width:'25vw'
    },
    followerDrawWrapperPhone:{
        display:'flex',
    },
    followerDrawWrapperHide:{
        display:'none',
    },
    progress:{

    },
    [`@media (max-width: ${minWidth}px)`]: {
        mainContainer:{
            flexDirection:'column',
            alignItems:'center',
            width:'100vw',
        },
        mainCardDiaryWrapper: {
        },
        todoListWrapper:{
            position: 'static',
            width:'80%',
            height:'auto',
            marginTop:'10%',
        },

        typography: {
            fontSize:'0.7em',
        },
    },
}));