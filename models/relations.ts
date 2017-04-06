module.exports = function(tenantModel, userModel){
    userModel.belongsTo(tenantModel);
};