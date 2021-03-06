module.exports = function (sequelize, DataTypes) {
    var userModel = sequelize.define("user", {
        identityUserID: {
            type: DataTypes.STRING,
            validate: {}
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                var options = {
                    foreignKey: 'createdByUserID'
                };
                //userModel.hasOne(models.user, options);
            },
            addUser: function (identityID) {
                userModel.create({ identityUserID: identityID });
            }
        }
    });
    return userModel;
};
