/* eslint-disable no-console */
import icons from "./icon";
export default {
  handle(items, highFilter, keyWord, keyMap) {
    console.log(highFilter, keyWord);

    if (highFilter !== "") {
      switch (highFilter) {
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
      }
    }

    if (keyWord !== "") {
      var regex = keyMap[keyWord];
      if (regex) {
        items = items.filter(item => item.path.search(keyMap[keyWord]) > 0);
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
        name: item.kMDItemFSName,
        size: item.kMDItemFSSize,
        type: item.kMDItemContentType,
        kind: item.kMDItemKind,
        count: item.kMDItemFSNodeCount,
        createDate: item.kMDItemFSCreationDate,
        updateDate: item.kMDItemFSContentChangeDate,
        text: "",
        thumbnails: "",
        preview: "",
        files: []
      });
    }

    return data;
  },
  sort(data, field, type) {
    return data.sort(this.sortByField(field, type));
  },
  sortByField(field, type) {
    return (a, b) => {
      var f1 = a[field];
      var f2 = b[field];
      return (f1 < f2 ? 1 : f1 > f2 ? -1 : 0) * type;
    };
  }
};
