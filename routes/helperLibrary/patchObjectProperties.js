module.exports = function (body, model) {
    var patchObject = {};
    Object.keys(body).every(checkAgainstModel);
    function checkAgainstModel(elementKey, index, array) {
        //Ignore ID Column as it cannot be updated
        if (elementKey.trim().toLowerCase() != 'id') {
            Object.keys(model.tableAttributes)
                .every(function (modelElementKey, modelIndex, modelArray) {
                console.log(elementKey + ' - ' + modelElementKey);
                if (modelElementKey.trim().toLowerCase() == elementKey.trim().toLowerCase()) {
                    patchObject[modelElementKey] = body[elementKey];
                    return false;
                }
                return true;
            });
        }
        return true;
    }
    return patchObject;
};
