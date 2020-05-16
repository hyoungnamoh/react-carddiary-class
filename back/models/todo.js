module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', { //앞에 대문자로 만들면 테이블 만들어질 때 자동으로 앞에 소문자로 바뀌고 뒤에 s붙음
        todoContent: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4', //한글에 이모티콘까지 가능
        collate: 'utf8mb4_general_ci',
    });

    Todo.associate = (db) => {

        db.Todo.belongsTo(db.User);
    };

    return Todo;
}