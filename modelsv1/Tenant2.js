module.exports = function (sequelize, DataTypes) {
    console.log('hit');
    var tenantModel = sequelize.define("tenant", {
        name: DataTypes.STRING,
        code: DataTypes.STRING,
    });
    var userModel = sequelize.define("user", {
        identityUserID: DataTypes.STRING
    });
    tenantModel.belongsTo(userModel);
    return tenantModel;
};
