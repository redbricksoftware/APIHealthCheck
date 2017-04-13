module.exports = function (sequelize, DataTypes) {
    var configModel = sequelize.define("config", {
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        protocol: {
            type: DataTypes.STRING,
            defaultValue: 'HTTPS',
            validate: {
                notEmpty: true
            }
        },
        uri: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true,
                notEmpty: true
            }
        },
        port: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: true
            }
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1,
        },
        pollFrequencyInSeconds: {
            type: DataTypes.INTEGER,
            defaultValue: 3600,
            validate: {
                isNumeric: true
            }
        },
        degradedResponseTimeMS: {
            type: DataTypes.INTEGER,
            defaultValue: 950,
            validate: {
                isNumeric: true
            }
        },
        failedResponseTimeMS: {
            type: DataTypes.INTEGER,
            defaultValue: 1500,
            validate: {
                isNumeric: true
            }
        },
        expectedResponseCode: {
            type: DataTypes.STRING,
            defaultValue: '2XX',
            validate: {
                notEmpty: true
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                var tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                configModel.belongsTo(models.tenant, tenantIDOptions);
            }
        }
    });
    return configModel;
};
