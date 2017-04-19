module.exports = function (sequelize, DataTypes) {
    var healthCheckSummaryModel = sequelize.define("healthCheckSummary", {
        uri: {
            type: DataTypes.STRING
        },
        averageRequestLengthMS: {
            type: DataTypes.INTEGER
        },
        requestDate: {
            type: DataTypes.DATE
        },
        activeResponsePercent: {
            type: DataTypes.DOUBLE
        },
        degradedResponsePercent: {
            type: DataTypes.DOUBLE
        },
        failedResponsePercent: {
            type: DataTypes.DOUBLE
        },
        otherResponsePercent: {
            type: DataTypes.DOUBLE
        }
    }, {
        classMethods: {
            associate: function (models) {
                var tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                healthCheckSummaryModel.belongsTo(models.tenant, tenantIDOptions);
                var configIDOptions = {
                    foreignKey: 'configID'
                };
                healthCheckSummaryModel.belongsTo(models.config, configIDOptions);
            }
        }
    });
    return healthCheckSummaryModel;
};
