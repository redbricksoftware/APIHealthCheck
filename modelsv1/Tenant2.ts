module.exports = function(sequelize, DataTypes) {
    console.log('hit');

    let tenantModel = sequelize.define("tenant", {
        name: DataTypes.STRING,
        code: DataTypes.STRING,

    });

    let userModel = sequelize.define("user", {
            identityUserID: DataTypes.STRING
        });


    tenantModel.belongsTo(userModel);


    return tenantModel;
};