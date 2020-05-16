import {createMuiTheme, fade, makeStyles, withStyles} from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";


const minWidth = 1000
export const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        marginTop: 5,
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 14,
        padding: '5px 5px 5px 5px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
    [`@media (max-width: ${minWidth}px)`]: {
        root:{
            display: 'none',
            width:'0vw',
        },
    },
}))(InputBase);

//메인 스타일
export const AppLayoutStyle = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    hide: {
        display: 'none',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            // marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(2, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
    margin: {
        margin: theme.spacing(1),
        // marginRight:0,
    },
    formControllerWrapper: {
        display:'flex',
        justifyContent:'center',
        width:'25vw',
    },
    logo:{
        display:'flex',
        justifyContent:'center',
        width:'20vw',
    },
    tabs: {
        display:'flex',
        justifyContent:'center',
        width:'50vw',
    },
    tab:{
        padding:0,
    },
    drawer:{
        display:'none',
    },
    toolbarWrapper:{
        display:'flex',
    },


    [`@media all and (max-width:${minWidth}px)`]: {
        toolbar:{

        },
        searchIcon:{
            display:'none',
            width:'0vw',
        },
        search:{
            display:'none',
            width:'0vw',
        },
        formControllerWrapper: {
            width:'0vw',
        },
        tabs:{
            width:'100vw',
        },
        tab:{
            width:'10vw', padding:0,
        },
        logo :{
            padding:0,
        },
        toolbarWrapper:{
            flexDirection: 'column',
        },
        logoButton:{
            padding:0,
        }
    },
    // @media all and (min-width:768px) and (max-width:1024px) { … } // 뷰포트 너비가 768px 이상 '그리고' 1024px 이하이면 실행
    [`@media all and (max-width: 1000px`]: {
        drawer:{
            display:'flex',
            justifyContent:'flex-end',
        },
    },
}));