"use strict";
var util_1 = require("util");
var Error_1 = require("./Error");
var util_2 = require("util");
var Tenant = (function () {
    function Tenant() {
    }
    Tenant.prototype.validate = function () {
        var me = this;
        return new Promise(function (resolve, reject) {
            var errors = new Array();
            if (util_1.isNullOrUndefined(me.name) || me.name.toString().trim() == '') {
                errors.push(new Error_1.Error('name', 'name is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.code) || me.code.toString().trim() == '') {
                errors.push(new Error_1.Error('code', 'code is a required field.', Error_1.ErrorType.Error));
            }
            if (util_1.isNullOrUndefined(me.primaryUserID) || me.primaryUserID < 1) {
                errors.push(new Error_1.Error('primaryUserID', 'primaryUserID is a required field.', Error_1.ErrorType.Error));
            }
            if (!util_2.isNumber(me.primaryUserID)) {
                errors.push(new Error_1.Error('primaryUserID', 'primaryUserID is not a valid number.', Error_1.ErrorType.Error));
            }
            if (errors.length > 0) {
                reject(errors);
            }
            else {
                resolve(true);
            }
        });
    };
    return Tenant;
}());
exports.Tenant = Tenant;
