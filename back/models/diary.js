module.exports = (sequelize, DataTypes) => {
    const Diary = sequelize.define('Diary', { //앞에 대문자로 만들면 테이블 만들어질 때 자동으로 앞에 소문자로 바뀌고 뒤에 s붙음
        diaryTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        diaryContent: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isFavorite:{
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        isPublic:{
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    }, {
        charset: 'utf8mb4', //한글에 이모티콘까지 가능
        collate: 'utf8mb4_general_ci',
    });

    Diary.associate = (db) => {
        db.Diary.belongsTo(db.User); // 테이블에 UserId 컬럼이 생겨요
        db.Diary.hasMany(db.Image);
        db.Diary.belongsToMany(db.Hashtag, { through: 'DiaryHashtag' });
        db.Diary.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    };

    return Diary;
}