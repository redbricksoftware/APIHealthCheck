module.exports = function (sequelize, DataTypes) {

    let configModel = sequelize.define("config", {
        name: {
            type: DataTypes.STRING
        },
        protocol: {
            type: DataTypes.STRING,
            defaultValue: 'HTTPS'
        },
        uri: {
            type: DataTypes.STRING,
            validate: {
                isUrl: true
            }
        },
        port: {
            type: DataTypes.INTEGER
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: 1
        },
        pollFrequencyInSeconds: {
            type: DataTypes.INTEGER,
            defaultValue: 3600 //Every hour
        },
        degradedResponseTimeMS: {
            type: DataTypes.INTEGER,
            defaultValue: 950
        },
        failedResponseTimeMS:  {
            type: DataTypes.INTEGER,
            defaultValue: 1500
        },
        expectedResponseCode: {
            type: DataTypes.STRING,
            defaultValue: '2XX'
        }
    }, {
        classMethods: {
            associate: function (models) {
                let tenantIDOptions = {
                    foreignKey: 'tenantID'
                };
                configModel.belongsTo(models.tenant, tenantIDOptions);
            }
        }
    });

    return configModel;
};