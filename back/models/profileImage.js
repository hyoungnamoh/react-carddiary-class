module.exports = (sequelize, DataTypes) => {
    const ProfileImage = sequelize.define('ProfileImage', { //앞에 대문자로 만들면 테이블 만들어질 때 자동으로 앞에 소문자로 바뀌고 뒤에 s붙음
        src: {
            type: DataTypes.STRING(200),
            allowNull: true,
        },
    }, {
        charset: 'utf8mb4', //한글에 이모티콘까지 가능
        collate: 'utf8mb4_general_ci',
    });

    ProfileImage.associate = (db) => {
        db.ProfileImage.belongsTo(db.User);
    };
    sequelize.query('CREATE TRIGGER trigger_default_image AFTER INSERT ON users' +
        ' FOR EACH ROW' +
        ' BEGIN' +
        ' insert into profileimages (src, createdAt, updatedAt, userid) values(null, NOW(), NOW(), new.id);' +
        'END;')

    return ProfileImage;
}