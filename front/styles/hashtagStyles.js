import {createMuiTheme, fade, makeStyles, withStyles} from "@material-ui/core/styles";
import {blue} from "@material-ui/core/colors";

const minWidth = 1000;
export const hastagStyle = makeStyles((theme) => ({
    mainContainer: {
        display: 'flex',
    },
    mainCardDiaryWrapper: {
        display:'flex',
        justifyContent:'flex-start',
        flexDirection:'row',
        width:'50vw',
        marginTop: '3%',
        marginLeft:'4%',
        marginRight:'3%'
    },
    gridList: {
    },
    icon: {
        color: 'rgba(255, 255, 255, 0.54)',
    },
    diariesContainer: {
        marginTop:"3%",
        marginBottom:"3%",
    },
    todoListWrapper:{
        display:'flex', width:'25vw',
        position: 'sticky',
        top: '12%',
        left:'1%',
        height: '800px',
    },
    [`@media (max-width: ${minWidth}px)`]: {
        mainContainer:{
            flexDirection:'column',
            alignItems:'center',
            width:'100vw',
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
        gridList: {
            display:'flex',
            justifyContent:''
        },
        mainCardDiaryWrapper: {
            flexDirection:'row',
            width:'100vw',
            marginTop: '3%',
            marginLeft:'4%',
            marginRight:'3%'
        },
        diariesContainer: {
            marginTop:"3%",
            marginBottom:"3%",
        },
    },
}));