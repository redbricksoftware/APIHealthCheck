module.exports = function (sequelize, DataTypes) {
    var notificationModel = sequelize.define('message', {
        from: {
            type: DataTypes.STRING,
            validate: {}
        },
        message: {
            type: DataTypes.STRING,
            validate: {}
        },
        messageTime: {
            type: DataTypes.DATE,
            validate: {}
        }
    }, {
        classMethods: {
            associate: function (models) {
                var tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                notificationModel.belongsTo(models.tenant, tenantIDOptions);
                var userIDOptions = {
                    foreignKey: 'userIDTo'
                };
                notificationModel.belongsTo(models.user, userIDOptions);
            }
        }
    });
    return notificationModel;
};
