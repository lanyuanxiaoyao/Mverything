/* eslint-disable no-console */
import icons from "./icon";
export default {
  handle(items, keyWord) {
    if (keyWord !== "") {
      switch (keyWord) {
        // file
        case "f":
          items = items.filter(
            item => item.kMDItemContentType !== "public.folder"
          );
          break;
        // folder
        case "F":
          items = items.filter(
            item => item.kMDItemContentType === "public.folder"
          );
          break;
        // picture
        case "p":
          var picRegex = /png|jpg|jpeg|ico|bmp|gif|psd|svg|tif|eps|raw/i;
          items = items.filter(
            item => item.kMDItemContentType.search(picRegex) > 0
          );
          break;
      }
    }

    var data = [];
    var length = items.length;
    for (var i = 0; i < length; i++) {
      var item = items[i];
      if (item === undefined) {
        continue;
      }
      var icon = icons.icon(item);
      data.push({
        path: item.path,
        icon: icon,
        name: item.kMDItemFSName
      });
    }

    return data.sort();
  }
};
