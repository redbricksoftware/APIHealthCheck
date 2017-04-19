module.exports = function (sequelize, DataTypes) {
    var notificationModel = sequelize.define("notification", {
        notification: {
            type: DataTypes.STRING,
            validate: {}
        },
        notificationTime: {
            type: DataTypes.DATE,
            validate: {}
        },
        notificationType: {
            type: DataTypes.INTEGER,
            validate: {}
        }
    }, {
        classMethods: {
            associate: function (models) {
                var tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                notificationModel.belongsTo(models.tenant, tenantIDOptions);
                var configIDOptions = {
                    foreignKey: 'configID'
                };
                notificationModel.belongsTo(models.config, configIDOptions);
            }
        }
    });
    return notificationModel;
};
