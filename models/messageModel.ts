module.exports = function (sequelize, DataTypes) {

    let notificationModel = sequelize.define('message', {
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
                let tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                notificationModel.belongsTo(models.tenant, tenantIDOptions);

                let userIDOptions = {
                    foreignKey: 'userIDTo'
                };
                notificationModel.belongsTo(models.user, userIDOptions);
            }
        }
    });


    return notificationModel;
};

