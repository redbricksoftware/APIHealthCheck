module.exports = function (sequelize, DataTypes) {
    var healthCheckDetailModel = sequelize.define("healthCheckDetail", {
        uri: {
            type: DataTypes.STRING
        },
        responseCode: {
            type: DataTypes.STRING
        },
        requestLengthMS: {
            type: DataTypes.INTEGER
        },
        requestTime: {
            type: DataTypes.DATE
        },
        responseStatus: {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function (models) {
                var tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                healthCheckDetailModel.belongsTo(models.tenant, tenantIDOptions);
                var configIDOptions = {
                    foreignKey: 'configID'
                };
                healthCheckDetailModel.belongsTo(models.config, configIDOptions);
            }
        }
    });
    return healthCheckDetailModel;
};
