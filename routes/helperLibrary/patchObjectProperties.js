module.exports = function (body, model) {
    var patchObject = {};
    Object.keys(body).every(checkAgainstModel);
    function checkAgainstModel(elementKey, index, array) {
        Object.keys(model.tableAttributes)
            .every(function (modelElementKey, modelIndex, modelArray) {
            console.log(elementKey + ' - ' + modelElementKey);
            if (modelElementKey.trim().toUpperCase() == elementKey.trim().toUpperCase()) {
                patchObject[modelElementKey] = body[elementKey];
                return false;
            }
            return true;
        });
        return true;
    }
    return patchObject;
};
