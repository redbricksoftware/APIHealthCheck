module.exports = function (sequelize, DataTypes) {

    let healthCheckSummaryModel = sequelize.define("healthCheckSummary", {
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
                let tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                healthCheckSummaryModel.belongsTo(models.tenant, tenantIDOptions);

                let configIDOptions = {
                    foreignKey: 'configID'
                };
                healthCheckSummaryModel.belongsTo(models.config, configIDOptions);
            }
        }
    });

    return healthCheckSummaryModel;
};