module.exports = function (sequelize, DataTypes) {
    var tenantModel = sequelize.define("tenant", {
        name: {
            type: DataTypes.STRING,
            validate: {}
        },
        code: {
            type: DataTypes.STRING,
            validate: {}
        },
        maxAPIs: {
            type: DataTypes.INTEGER,
            defaultValue: 10
        },
        minimumRequestFrequency: {
            type: DataTypes.INTEGER,
            defaultValue: 3600
        }
    }, {
        classMethods: {
            associate: function (models) {
                var options = {
                    foreignKey: 'createdByUserID'
                };
                tenantModel.belongsTo(models.user, options);
            },
            addTenant: function (name, code, id) {
                tenantModel.create({ name: name, code: code, createdByUserID: id });
            },
            getAll: function () {
                tenantModel.findAll().then(function (tenants) {
                    console.log(tenants);
                });
            }
        }
    });
    return tenantModel;
};
