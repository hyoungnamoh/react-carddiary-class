import React, {Component} from "react";
import {Divider, ListItemSecondaryAction, Paper, TextField} from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

class TodoList extends Component{
    constructor(props) {
        super(props);
        console.log(this.props);
    }
    state = {
        checked: [],
        left: [0,1,2,3],
        onAdd: false,
        todoContent: '',

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.isAddedTodo !== prevProps.isAddedTodo){
            console.log('update');
            this.setState({
                todoContent: '',
                onAdd: false,
            });
        }
    }

    handleToggle = (value) => () => {
        const currentIndex = this.state.checked.indexOf(value);
        const newChecked = this.state.left.splice(currentIndex, 1);
        this.setState({checked: newChecked});
    };

    onClickTodoAdd = () => {
        this.setState({onAdd: true});
    }
    onClickTodoAddCancel = () => {
        this.setState({todoContent: ''});
        this.setState({onAdd: false});
    }
    onChangeTodoContent = (e) => {
        this.setState({todoContent: e.target.value});
    }

    render() {
        return (
            <>
                <Paper style={{
                    display: 'inline - block',
                    width: '100%',
                    height: '100%',
                }}>
                    <List dense component="div" role="list" style={{}}>
                        <ListSubheader component="div" id="nested-list-subheader" style={{display:'flex', textAlign:'center', fontSize:'1.5em', justifyContent:'center'}}>
                            To - Do List
                            <div style={{display:'flex', }}>
                            { !this.state.onAdd
                                ?
                                <ListItemSecondaryAction >
                                    <IconButton edge="end" aria-label="remove" onClick={this.onClickTodoAdd}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                                :
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="remove" onClick={this.onClickTodoAddCancel}>
                                        <ClearIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            }
                            </div>
                        </ListSubheader>
                        <Divider />
                        { this.state.onAdd &&
                            <ListItem role={undefined} dense text>
                                <TextField
                                    id="outlined-size-small"
                                    variant="outlined"
                                    size="small"
                                    style={{width:'80%', marginLeft:'3%'}}
                                    value={this.state.todoContent}
                                    onChange={this.onChangeTodoContent}
                                    autoFocus={true}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" aria-label="remove" onClick={() => {
                                        this.props.onClickTodoPost(this.state.todoContent);
                                    }}>
                                        <AddCircleOutlineIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        }

                        {this.props.todoList.map((todo, index) => {
                            return (
                                <ListItem key={todo.todoContent} role={undefined} dense button onClick={this.handleToggle(index)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText  primary={todo.todoContent} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="remove" onClick={this.props.onClickTodoRemove(todo.id)}>
                                            <RemoveCircleOutlineIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            );
                        })}
                        <ListItem />
                    </List>
                </Paper>
            </>
        );
    };
};

export default TodoList;