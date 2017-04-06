module.exports = function (sequelize, DataTypes) {

    let userModel = sequelize.define("user", {
        identityUserID: {
            type: DataTypes.STRING,
            validate: {
            }
        }
    }, {
        classMethods: {
            addUser: function (identityID) {
                userModel.create({identityUserID: identityID});
            }
        }
    });


    return userModel;
};

