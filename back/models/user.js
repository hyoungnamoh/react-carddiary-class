module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', { //앞에 대문자로 만들면 테이블 만들어질 때 자동으로 앞에 소문자로 바뀌고 뒤에 s붙음
        userName: {
            type: DataTypes.STRING(20),
            allowNull: false, //필수
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false, //false 면 필수 true면 선택
            unique: true,
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    }, {
        charset: 'utf8',
        collate: 'utf8_general_ci',
    });

    User.associate = (db) => {
        db.User.hasMany(db.Diary, {as: 'Diaries'});
        db.User.hasMany(db.Todo, {as: 'Todo'});
        db.User.belongsToMany(db.Diary, {through: 'Like', as: 'Liked'}); //게시글에 좋아요 클릭, 다 : 다
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId'});
        db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followerId'});
        db.User.hasMany(db.ProfileImage, {as: 'ProfileImage'});

    };

    return User;
};