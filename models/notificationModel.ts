module.exports = function (sequelize, DataTypes) {

    let notificationModel = sequelize.define("notification", {
        notification: {
            type: DataTypes.STRING,
            validate: {
            }
        },
        notificationTime: {
            type: DataTypes.DATE,
            validate: {
            }
        },
        notificationType: {
            type: DataTypes.INTEGER,
            validate: {
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                let tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                notificationModel.belongsTo(models.tenant, tenantIDOptions);

                let configIDOptions = {
                    foreignKey: 'configID'
                };
                notificationModel.belongsTo(models.config, configIDOptions);
            }
        }
    });


    return notificationModel;
};

