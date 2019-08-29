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
    if (!settings["data"]["databaseVersion"] || settings["data"]["databaseVersion"] < 1) {
      settings["data"]["databaseVersion"] = 1;
      settings["data"]["fileExtension"] = "txt,java,py,c,cpp,html,css,vue";
      settings["data"]["pictureExtension"] = "png,jpg,jpeg,bmp,svg,ico";
    }
    if (!settings["data"]["databaseVersion"] || settings["data"]["databaseVersion"] < 2) {
      settings["data"]["databaseVersion"] = 2;
      settings["data"]["preview"] = {
        native: false
      }
    }
    console.log("database update finish:", settings);
    return settings;
  }
};