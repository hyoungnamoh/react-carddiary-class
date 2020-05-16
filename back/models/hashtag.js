module.exports = (sequelize, DataTypes) => {
    const Hashtag = sequelize.define('Hashtag', { //앞에 대문자로 만들면 테이블 만들어질 때 자동으로 앞에 소문자로 바뀌고 뒤에 s붙음
        name: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
    }, {
        charset: 'utf8mb4', //한글에 이모티콘까지 가능
        collate: 'utf8mb4_general_ci',
    });

    Hashtag.associate = (db) => {
        db.Hashtag.belongsToMany(db.Diary, {through: 'DiaryHashtag'}); //다 : 다 관계에서 필요한 PK 테이블 자동생성 through
    };

    return Hashtag;
}