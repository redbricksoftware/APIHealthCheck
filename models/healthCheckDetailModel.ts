module.exports = function (sequelize, DataTypes) {

    let healthCheckDetailModel = sequelize.define("healthCheckDetail", {
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
                let tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                healthCheckDetailModel.belongsTo(models.tenant, tenantIDOptions);

                let configIDOptions = {
                    foreignKey: 'configID'
                };
                healthCheckDetailModel.belongsTo(models.config, configIDOptions);
            }
        }
    });

    return healthCheckDetailModel;
};