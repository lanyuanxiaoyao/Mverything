/* eslint-disable no-console */
export default {
  getExtension(name) {
    var index = name.lastIndexOf(".") || 0;
    if (index > 0) {
      return name.substring(index + 1, name.length).toLowerCase();
    }
    return "";
  },
  generateListToMap(list, keyName, valueName) {
    var result = {};
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      result[item[keyName]] = item[valueName];
    }
    return result;
  },
  findIndexInList(list, key, keyName) {
    for (var i = 0; i < list.length; i++) {
      if (key === list[i][keyName]) {
        return i;
      }
    }
    return -1;
  },
  databaseUpdate(settings) {
    console.log("database update before:", settings);
    if (!settings["databaseVersion"] || settings["databaseVersion"] < 1) {
      settings["databaseVersion"] = 1;
      settings["fileExtension"] = "txt,java,py,c,cpp,html,css,vue";
      settings["pictureExtension"] = "png,jpg,jpeg,bmp,svg,ico";
    }
    console.log("database update finish:", settings);
    return settings;
  }
};