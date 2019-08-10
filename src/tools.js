export default {
  getExtension(name) {
    var index = name.lastIndexOf(".") || 0;
    if (index > 0) {
      return name.substring(index + 1, name.length).toLowerCase();
    }
    return "";
  },
  generateListToMap(list, keyName, valueName) {
    var result = {}
    for(var i = 0; i < list.length; i++) {
      var item = list[i]
      result[item[keyName]] = item[valueName]
    }
    return result
  }
}