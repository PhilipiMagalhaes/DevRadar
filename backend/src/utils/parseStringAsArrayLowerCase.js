module.exports = function parseStringAsArraylower(arrayAsString) {
    return arrayAsString.split(',').map(item => item.trim().toLowerCase()).filter(item => item !='');   
 }