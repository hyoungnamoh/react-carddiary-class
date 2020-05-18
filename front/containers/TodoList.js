import {connect} from "react-redux";
import TodoList from "../components/TodoList";
import {ADD_TODO_REQUEST, REMOVE_TODO_REQUEST} from "../reducers/user";

const mapStateToProps = (state) => {
    const {todoList, isAddedTodo} = state.user;
    return {
        todoList,
        isAddedTodo,
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        onClickTodoPost: (todoContent) => {
            dispatch({
                type: ADD_TODO_REQUEST,
                data: {
                    todoContent
                },
            });
        },
        onClickTodoRemove: (todoId) => () => {
            dispatch({
                type: REMOVE_TODO_REQUEST,
                data:todoId,
            });
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(TodoList);