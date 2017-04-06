module.exports = function (sequelize, DataTypes) {

    let tenantModel = sequelize.define("tenant", {
        name: {
            type: DataTypes.STRING,
            validate: {
                //isInt: true,
                len: [1, 25]
            }
        },
        code: {
            type: DataTypes.STRING,
            validate: {
                //isInt: true,
                len: [1, 5]
            }
        },
        createdByUserID: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                let options = {
                    foreignKey: 'createdByUserID'
                };
                //models.user.hasOne(tenantModel, options);
                tenantModel.hasOne(models.user, options);
                //tenantModel.belongsTo({as: 'createdByUserID'})
            },
            addTenant: function (name, code, id) {
                tenantModel.create({name: name, code: code, createdByUserID: id});
            },
            getAll: function () {
                tenantModel.findAll().then(function (tenants) {
                    console.log(tenants)
                })
            }
        }
    });

    return tenantModel;
};