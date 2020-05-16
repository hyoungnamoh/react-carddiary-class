import {makeStyles} from "@material-ui/core/styles";

const drawerWidthPhone = 70;
const drawerWidthWeb = 25;
export const followDrawerStylePhone = makeStyles((theme) => ({
        appBar: {
            width: `calc(100% - ${drawerWidthPhone}vw)`,
            // marginLeft: drawerWidth,
        },
        drawer: {
            width: `${drawerWidthPhone}vw`,
            flexShrink: 0,
        },
        drawerPaper: {
            width: `${drawerWidthPhone}vw`,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            marginTop:'3vh',
        },
        drawerHeaderArrow:{
            display: 'flex',
            width:'5%',
        },
        tabs:{
            display: 'flex',
            justifyContent: 'space-between',
            width:'80%',
        },
        tab:{
            width:'50%',
        },
        listWrapper: {
        },
        avatarWrapper:{
        },
        avatar: {
        },
        userInfo:{
        },
        followButton:{
            height:'20%',
            marginBottom:'30%',
            padding:0,
        },

    }),
);

export const followDrawerStyleWeb = makeStyles((theme) => ({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - ${drawerWidthWeb}vw)`,
        },
        drawer: {
            width: `${drawerWidthWeb}vw`,
            flexShrink: 0,
        },
        drawerPaper: {
            width: `${drawerWidthWeb}vw`,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
        drawerHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
            justifyContent: 'space-around',
        }
    }),
);

export const followDrawerStyleHide = makeStyles((theme) => ({
        drawer: {
            display: 'none',
        }
    }),
);