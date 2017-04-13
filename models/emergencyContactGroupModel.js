module.exports = function (sequelize, DataTypes) {
    var emergencyContactGroupModel = sequelize.define("emergencyContactGroup", {
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
                var tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                emergencyContactGroupModel.belongsTo(models.tenant, tenantIDOptions);
                var userIDOptions = {
                    foreignKey: 'userID'
                };
                emergencyContactGroupModel.belongsTo(models.user, userIDOptions);
            }
        }
    });
    return emergencyContactGroupModel;
};
