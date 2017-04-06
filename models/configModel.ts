module.exports = function (sequelize, DataTypes) {

    let configModel = sequelize.define("config", {
        tenantID: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        uri: {
            type: DataTypes.STRING
        },
        enabled: {
            type: DataTypes.BOOLEAN
        },
        pollFrequencyInSeconds: {
            type: DataTypes.INTEGER
        },
        maxResponseTimeMS:  {
            type: DataTypes.INTEGER
        },
        emergencyContactGroupID:  {
            type: DataTypes.INTEGER
        }
    }, {
        classMethods: {
            associate: function (models) {
                configModel.belongsTo(models.user);
                //configModel.hasMany(models.user);
            }
        }
    });

    return configModel;
};
