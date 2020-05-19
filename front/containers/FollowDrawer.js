import {connect} from "react-redux";
import FollowDrawer from "../components/FollowDrawer";

const mapStateToProps = (state) => {
    const {todoList, isAddedTodo} = state.user;
    return {
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FollowDrawer);