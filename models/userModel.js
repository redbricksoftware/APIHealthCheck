module.exports = function (sequelize, DataTypes) {
    var userModel = sequelize.define("user", {
        identityUserID: {
            type: DataTypes.STRING,
            validate: {}
        }
    }, {
        classMethods: {
            addUser: function (identityID) {
                userModel.create({ identityUserID: identityID });
            }
        }
    });
    return userModel;
};
