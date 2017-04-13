module.exports = function (sequelize, DataTypes) {

    let emergencyContactGroupModel = sequelize.define("emergencyContactGroup", {
        name: {
            type: DataTypes.STRING
        },
        alertsBeforeContact: {
            type: DataTypes.INTEGER,
            defaultValue: 3
        }
    }, {
        classMethods: {
            associate: function (models) {
                let tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                emergencyContactGroupModel.belongsTo(models.tenant, tenantIDOptions);
                let userIDOptions = {
                    foreignKey: 'userID'
                };
                emergencyContactGroupModel.belongsTo(models.user, userIDOptions);
            }
        }
    });

    return emergencyContactGroupModel;
};